import React from 'react';

const Summary = ({ results }) => {
  return (
    <div className="mt-8 bg-white shadow rounded p-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Zusammenfassung</h2>
      <p className="text-sm text-gray-700">
        Die ROI-Kalkulation zeigt, wie sich die Kosten der KI-Nutzung im Vergleich zu menschlicher Arbeit auswirken. Die wichtigsten Kennzahlen sind:
      </p>
      <ul className="mt-4 space-y-2 text-gray-600">
        <li>
          <strong className="font-medium">Gesamtkosten für menschliche Arbeit:</strong> ${results.humanTotal}
        </li>
        <li>
          <strong className="font-medium">Durch KI abgedeckte Kosten:</strong> ${results.aiCovered}
        </li>
        <li>
          <strong className="font-medium">Verbleibende menschliche Kosten:</strong> ${results.humanRemain}
        </li>
        <li>
          <strong className="font-medium">Gesamtkosten für API Calls:</strong> ${results.totalApi}
        </li>
        <li>
          <strong className="font-medium">Einsparungen durch KI:</strong> ${results.savings}
        </li>
        <li>
          <strong className="font-medium">Benötigte Zeit:</strong> {results.totalHours} Stunden / {results.totalDays} Tage
        </li>
      </ul>
    </div>
  );
};

export default Summary;
