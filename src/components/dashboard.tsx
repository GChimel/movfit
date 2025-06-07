export default function DashboardExample() {
  return (
    <div className="w-full md:w-[750px] h-auto md:h-[450px] rounded-md bg-forth-gray shadow-2xl flex flex-col md:flex-row overflow-hidden border border-[#2c3742] mx-auto">
      <aside className="w-full md:w-48 bg-forth-gray flex flex-col p-4 gap-4">
        <span className="text-primary-green font-bold text-2xl ">movefit</span>
        <div className="bg-tertiary-gray h-6 rounded-md" />
        <div className="bg-tertiary-gray h-6 w-16 rounded-md" />
        <div className="bg-tertiary-gray h-6 rounded-md" />
        <div className="bg-tertiary-gray h-6 w-16 rounded-md" />
      </aside>
      <main className="flex-1 p-4 flex flex-col justify-end">
        <div className="mt-auto mb-2 flex justify-end">
          <div className="bg-primary-green w-16 h-6 rounded-md" />
        </div>
        <div className="flex gap-2 flex-col bg-tertiary-gray p-6 rounded-md-xl">
          <div className="bg-forth-gray h-10 w-40 rounded-md" />
          <div className="bg-forth-gray h-4 md:w-80 rounded-md" />
          <div className="bg-forth-gray h-4 md:w-80 rounded-md" />
          <div className="bg-forth-gray h-4 w-40 rounded-md" />
          <div className="flex gap-2 flex-col md:flex-row">
            <div className="bg-forth-gray rounded-md-xl p-6 w-full md:w-64 shadow-lg">
              <div className="text-gray-400 text-xs mb-2">Revenue</div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold">45,000</span>
                <span className="text-primary-green text-xs">+3%</span>
              </div>
              <svg
                width="100%"
                height="60"
                viewBox="0 0 100 40"
                className="mt-4"
              >
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a2d260" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#a2d260" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <polyline
                  fill="url(#rev)"
                  stroke="#a2d260"
                  strokeWidth="2"
                  points="0,35 10,30 20,15 30,20 40,10 50,15 60,20 70,18 80,22 90,20 100,25 100,40 0,40"
                />
              </svg>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Jan</span>
                <span>Fev</span>
                <span>Mar</span>
              </div>
            </div>
            <div className="bg-forth-gray rounded-md p-6 w-full md:w-64 shadow-lg">
              <div className="text-gray-400 text-xs mb-2">Profit</div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold">60,000</span>
                <span className="text-primary-green text-xs">+10%</span>
              </div>
              <svg
                width="100%"
                height="60"
                viewBox="0 0 100 40"
                className="mt-4"
              >
                <rect x="5" y="30" width="8" height="10" fill="#a2d260" />
                <rect x="20" y="20" width="8" height="20" fill="#a2d260" />
                <rect x="35" y="15" width="8" height="25" fill="#a2d260" />
                <rect x="50" y="10" width="8" height="30" fill="#a2d260" />
                <rect x="65" y="5" width="8" height="35" fill="#a2d260" />
                <rect x="80" y="2" width="8" height="38" fill="#a2d260" />
              </svg>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Jan</span>
                <span>Fev</span>
                <span>Mar</span>
                <span>Abr</span>
                <span>Mai</span>
                <span>Jun</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
