import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import Service from "../models/Service";
import Provider from "../models/Provider";
import AllocationState from "../models/AllocationState";

async function seed() {

  const { default: dbConnect } = await import("../lib/mongodb");

  await dbConnect();

  // Clear collections
  await Service.deleteMany({});
  await Provider.deleteMany({});
  await AllocationState.deleteMany({});

  // Create services
  const services = await Service.insertMany([
    { name: "Service 1" },
    { name: "Service 2" },
    { name: "Service 3" },
  ]);

  // Create providers
  const providers = [];

  for (let i = 1; i <= 8; i++) {
    providers.push({
      name: `Provider ${i}`,
    });
  }

  await Provider.insertMany(providers);

  // Create allocation states
  const allocationStates = services.map((service) => ({
    serviceName: service.name,
    currentIndex: 0,
  }));

  await AllocationState.insertMany(allocationStates);

  console.log("Database seeded successfully!");

  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});