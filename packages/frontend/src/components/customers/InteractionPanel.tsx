export function InteractionPanel() {
  return (
    <div className="h-full p-4 space-y-6">
      {/* Interaction Logs */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-cyan-500">INTERACTION LOGS</h3>
      </div>

      {/* Ringover Logs */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-cyan-500">RINGOVER LOGS</h3>
        <div className="space-y-2">
          <div className="flex items-center">
            <span className="mr-2">↗️</span>
            <span>EMITED CALL</span>
          </div>
          <div className="flex items-center">
            <span className="mr-2">↙️</span>
            <span>RECEIVED CALL 12/05/21</span>
          </div>
          <div className="flex items-center">
            <span className="mr-2">📱</span>
            <span>RECEIVED SMS</span>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button className="text-cyan-500 hover:text-cyan-600">
            <span className="mr-2">💬</span>
            SEND QUICK SMS
          </button>
        </div>
      </div>

      {/* Email Logs */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-cyan-500">EMAIL LOGS</h3>
        <div className="mt-4 flex justify-end">
          <button className="text-cyan-500 hover:text-cyan-600">
            <span className="mr-2">✉️</span>
            SEND QUICK EMAIL
          </button>
        </div>
      </div>
    </div>
  );
}
