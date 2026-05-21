import { NextResponse } from "next/server";

import dbConnect from "@/lib/mongodb";
import Provider from "@/models/Provider";

export async function POST() {
  try {

    await dbConnect();

    await Provider.updateMany(
      {},
      {
        $set: {
          usedQuota: 0,
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: "Provider quotas reset successfully",
    });

  } catch (err: any) {

    return NextResponse.json(
      {
        error: err.message,
      },
      {
        status: 500,
      }
    );
  }
}