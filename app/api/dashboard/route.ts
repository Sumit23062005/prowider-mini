import { NextResponse } from "next/server";

import dbConnect from "../../../lib/mongodb";

import Lead from "../../../models/Leads";
import Provider from "../../../models/Provider";
import LeadAssignment from "../../../models/LeadAssignment";

// IMPORTANT:
// This import registers the Service model
import "../../../models/Service";

export async function GET() {
  try {
    await dbConnect();

    // ==================================================
    // FETCH PROVIDERS
    // ==================================================

    const providers = await Provider.find(
      {},
      "name monthlyQuota usedQuota"
    ).lean();

    // ==================================================
    // FETCH ASSIGNMENTS
    // ==================================================

    const assignments = await LeadAssignment.find({})
      .populate({
        path: "leadId",

        select:
          "name phone city serviceId createdAt",

        populate: {
          path: "serviceId",

          // Explicit model fixes MissingSchemaError
          model: "Service",

          select: "name",
        },
      })

      .populate({
        path: "providerId",
        select: "name",
      })

      .sort({ assignedAt: -1 })

      .lean();

    // ==================================================
    // GROUP ASSIGNMENTS BY PROVIDER
    // ==================================================

    const assignmentsByProvider: Record<
      string,
      any[]
    > = {};

    for (const assignment of assignments) {

      const provider: any =
        assignment.providerId;

      const pid =
        provider?._id?.toString();

      if (!pid) continue;

      if (!assignmentsByProvider[pid]) {
        assignmentsByProvider[pid] = [];
      }

      assignmentsByProvider[pid].push(
        assignment
      );
    }

    // ==================================================
    // BUILD PROVIDER DETAILS
    // ==================================================

    const providerDetails = providers.map(
      (provider: any) => {

        const pid =
          provider._id.toString();

        const assigned =
          assignmentsByProvider[pid] || [];

        return {
          _id: pid,

          name: provider.name,

          usedQuota:
            provider.usedQuota,

          monthlyQuota:
            provider.monthlyQuota,

          remainingQuota:
            provider.monthlyQuota -
            provider.usedQuota,

          totalAssignedLeads:
            assigned.length,

          assignedLeads:
            assigned.map((a: any) => {

              const lead: any =
                a.leadId;

              return {
                customerName:
                  lead?.name || "",

                phone:
                  lead?.phone || "",

                city:
                  lead?.city || "",

                service:
                  lead?.serviceId?.name ||
                  "",

                assignedAt:
                  a.assignedAt || null,
              };
            }),
        };
      }
    );

    // ==================================================
    // DASHBOARD SUMMARY
    // ==================================================

    const [
      totalLeads,
      totalProviders,
      recentLeads,
      recentAssignments,
    ] = await Promise.all([

      Lead.countDocuments(),

      Provider.countDocuments(),

      Lead.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),

      LeadAssignment.find()
        .sort({ assignedAt: -1 })
        .limit(10)
        .populate(
          "providerId",
          "name"
        )
        .lean(),
    ]);

    // ==================================================
    // RESPONSE
    // ==================================================

    return NextResponse.json({
      totalLeads,
      totalProviders,
      providers,
      recentLeads,
      recentAssignments,
      providerDetails,
    });

  } catch (err: any) {

    console.error(
      "Dashboard API Error:",
      err
    );

    return NextResponse.json(
      {
        error:
          err.message ||
          "Server error",
      },
      {
        status: 500,
      }
    );
  }
}