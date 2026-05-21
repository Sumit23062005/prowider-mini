export default function Home() {
  return (
    <main className="p-10">
      <h1 className="text-4xl font-bold">
        Prowider Mini Lead Distribution System
      </h1>

      <div className="mt-6 flex gap-4">
        <a href="/request-service">
          Request Service
        </a>

        <a href="/dashboard">
          Dashboard
        </a>

        <a href="/test-tools">
          Test Tools
        </a>
      </div>
    </main>
  );
}