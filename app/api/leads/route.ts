import { NextResponse } from "next/server";
import dbConnect from "../../../lib/mongodb";

import Service from "../../../models/Service";
import Lead from "../../../models/Leads";
import Provider from "../../../models/Provider";
import AllocationState from "../../../models/AllocationState";
import LeadAssignment from "../../../models/LeadAssignment";

const mandatoryProviders: Record<string, string[]> = {
  "Service 1": ["Provider 1"],
  "Service 2": ["Provider 5"],
  "Service 3": ["Provider 1", "Provider 4"],
};

const providerPools: Record<string, string[]> = {
  "Service 1": ["Provider 2", "Provider 3", "Provider 4"],

  "Service 2": ["Provider 6", "Provider 7", "Provider 8"],

  "Service 3": [
    "Provider 2",
    "Provider 3",
    "Provider 5",
    "Provider 6",
    "Provider 7",
    "Provider 8",
  ],
};

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();

    const {
      name,
      phone,
      city,
      service,
      description,
    } = body;

    // ==================================================
    // VALIDATION
    // ==================================================

    if (
      !name ||
      !phone ||
      !city ||
      !service ||
      !description
    ) {
      return NextResponse.json(
        {
          error: "All fields are required.",
        },
        {
          status: 400,
        }
      );
    }

    // ==================================================
    // FIND SERVICE
    // ==================================================

    const serviceDoc = await Service.findOne({
      name: service,
    });

    if (!serviceDoc) {
      return NextResponse.json(
        {
          error: "Invalid service.",
        },
        {
          status: 400,
        }
      );
    }

    // ==================================================
    // DUPLICATE CHECK
    // ==================================================

    const existingLead = await Lead.findOne({
      phone,
      serviceId: serviceDoc._id,
    });

    if (existingLead) {
      return NextResponse.json(
        {
          error:
            "Lead already exists for this service and phone.",
        },
        {
          status: 409,
        }
      );
    }

    // ==================================================
    // CREATE LEAD
    // ==================================================

    const lead = await Lead.create({
      name,
      phone,
      city,
      serviceId: serviceDoc._id,
      description,
    });

    // ==================================================
    // ASSIGNMENT ARRAYS
    // ==================================================

    const assignedProviders: string[] = [];

    const assignedProviderIds: string[] = [];

    // ==================================================
    // 1. ASSIGN MANDATORY PROVIDERS
    // ==================================================

    const mandatory =
      mandatoryProviders[service] || [];

    for (const providerName of mandatory) {

      const provider = await Provider.findOne({
        name: providerName,
      });

      if (
        provider &&
        provider.usedQuota <
          provider.monthlyQuota &&
        !assignedProviderIds.includes(
          provider._id.toString()
        )
      ) {

        assignedProviders.push(
          provider.name
        );

        assignedProviderIds.push(
          provider._id.toString()
        );
      }
    }

    // ==================================================
    // 2. ROUND ROBIN ASSIGNMENT
    // ==================================================

    if (assignedProviders.length < 3) {
      const pool = providerPools[service] || [];
      if (pool.length > 0) {
        // Atomic index increment and fetch
        const allocState = await AllocationState.findOneAndUpdate(
          { serviceName: service },
          { $inc: { currentIndex: 1 } },
          { new: true, upsert: true }
        );
        const startIndex = allocState.currentIndex % pool.length;
        for (let i = 0; i < pool.length; i++) {
          const providerName = pool[(startIndex + i) % pool.length];
          const provider = await Provider.findOne({ name: providerName });
          if (
            provider &&
            provider.usedQuota < provider.monthlyQuota &&
            !assignedProviderIds.includes(provider._id.toString())
          ) {
            assignedProviders.push(provider.name);
            assignedProviderIds.push(provider._id.toString());
            if (assignedProviders.length === 3) {
              break;
            }
          }
        }
      }
    }

    // ==================================================
    // ENSURE EXACTLY 3 PROVIDERS
    // ==================================================

    if (assignedProviders.length < 3) {

      return NextResponse.json(
        {
          error:
            "Not enough available providers.",
        },
        {
          status: 409,
        }
      );
    }

    // ==================================================
    // SAVE ASSIGNMENTS + UPDATE QUOTAS
    // ==================================================

    for (const providerId of assignedProviderIds) {

      await LeadAssignment.create({
        leadId: lead._id,
        providerId,
      });

      await Provider.findByIdAndUpdate(
        providerId,
        {
          $inc: {
            usedQuota: 1,
          },
        }
      );
    }

    // ==================================================
    // SUCCESS RESPONSE
    // ==================================================

    return NextResponse.json({
      success: true,
      lead,
      assignedProviders,
    });

  } catch (err: any) {
    // Handle Mongo duplicate key error (E11000)
    if (err?.code === 11000 || (err?.message && err.message.includes('E11000'))) {
      return NextResponse.json(
        {
          error: "Lead already exists for this service and phone.",
        },
        {
          status: 409,
        }
      );
    }

    // Fallback: clean error message
    return NextResponse.json(
      {
        error: "Server error. Please try again later.",
      },
      {
        status: 500,
      }
    );
  }
}