import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calculator } from 'lucide-react';
import Summary from './Summary';


const ROICalc = () => {
  // API Cost Section
  const [inTokens, setInTokens] = useState(0);
  const [outTokens, setOutTokens] = useState(0);
  const [inPrice, setInPrice] = useState(0.0015);
  const [outPrice, setOutPrice] = useState(0.005);
  const [calls, setCalls] = useState(1000);

  // Time and Cost Section
  const [aiTime, setAiTime] = useState(0);
  const [humanTime, setHumanTime] = useState(0);
  const [costType, setCostType] = useState('hourly');
  const [cost, setCost] = useState(0);
  const [tasks, setTasks] = useState(1);
  const [aiPercent, setAiPercent] = useState(0);

  // New fields for work time calculation
  const [hoursPerDay, setHoursPerDay] = useState(8);
  const [daysPerYear, setDaysPerYear] = useState(250);

  // Results
  const [results, setResults] = useState({
    callCost: 0,
    totalApi: 0,
    humanTotal: 0,
    aiCovered: 0,
    humanRemain: 0,
    savings: 0,
    totalHours: 0,
    totalDays: 0,
  });

  useEffect(() => {
    calcResults();
  }, [inTokens, outTokens, inPrice, outPrice, calls, aiTime, humanTime, costType, cost, tasks, aiPercent, hoursPerDay, daysPerYear]);

  const calcResults = () => {
    const callCost = (inTokens * inPrice / 1000 + outTokens * outPrice / 1000);
    const totalApi = callCost * calls;

    const costPerSec = costType === 'hourly' ? cost / 3600 : cost / (daysPerYear * hoursPerDay * 3600);
    const humanTotal = costPerSec * humanTime * tasks;

    const aiCovered = humanTotal * (aiPercent / 100);
    const humanRemain = humanTotal - aiCovered;

    const savings = aiCovered - totalApi;

    const totalSeconds = humanTime * tasks * (1 - aiPercent / 100);
    const totalHours = totalSeconds / 3600;
    const totalDays = totalHours / hoursPerDay;

    setResults({
      callCost: callCost.toFixed(5),
      totalApi: totalApi.toFixed(2),
      humanTotal: humanTotal.toFixed(2),
      aiCovered: aiCovered.toFixed(2),
      humanRemain: humanRemain.toFixed(2),
      savings: savings.toFixed(2),
      totalHours: totalHours.toFixed(2),
      totalDays: totalDays.toFixed(2),
    });
  };

  const chartData = [
    { name: 'KI Kosten', Kosten: parseFloat(results.totalApi) },
    { name: 'Menschliche Kosten (ohne KI)', Kosten: parseFloat(results.humanTotal) },
    { name: 'Verbleibende menschliche Kosten', Kosten: parseFloat(results.humanRemain) },
    { name: 'Einsparungen', Kosten: parseFloat(results.savings) },
  ];

  return (
    <div className="container mx-auto p-4 max-w-4xl bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
        <Calculator className="inline-block mr-2" />
        ROI Kalkulator: KI vs. Mensch
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* API Cost Section */}
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">API Kosten</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Input Tokens</label>
              <input type="number" value={inTokens} onChange={(e) => setInTokens(Number(e.target.value))}
                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Output Tokens</label>
              <input type="number" value={outTokens} onChange={(e) => setOutTokens(Number(e.target.value))}
                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Preis für Input Tokens ($ pro 1000)</label>
              <input type="number" value={inPrice} onChange={(e) => setInPrice(Number(e.target.value))}
                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" step="0.000001" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Preis für Output Tokens ($ pro 1000)</label>
              <input type="number" value={outPrice} onChange={(e) => setOutPrice(Number(e.target.value))}
                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" step="0.000001" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Anzahl API Calls</label>
              <input type="number" value={calls} onChange={(e) => setCalls(Number(e.target.value))}
                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Kosten pro API Call</label>
              <input type="text" value={`$${results.callCost}`} readOnly
                     className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Gesamtkosten für API Calls</label>
              <input type="text" value={`$${results.totalApi}`} readOnly
                     className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm" />
            </div>
          </div>
        </div>

        {/* Time and Cost Section */}
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">Zeit und Kosten</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">KI Bearbeitungszeit (Sekunden)</label>
              <input type="number" value={aiTime} onChange={(e) => setAiTime(Number(e.target.value))}
                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Menschliche Bearbeitungszeit (Sekunden)</label>
              <input type="number" value={humanTime} onChange={(e) => setHumanTime(Number(e.target.value))}
                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Menschliche Kosten</label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <select value={costType} onChange={(e) => setCostType(e.target.value)}
                        className="rounded-l-md border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                  <option value="hourly">Pro Stunde</option>
                  <option value="yearly">Pro Jahr</option>
                </select>
                <input type="number" value={cost} onChange={(e) => setCost(Number(e.target.value))}
                       className="flex-1 rounded-r-md border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Anzahl der Aufgaben</label>
              <input type="number" value={tasks} onChange={(e) => setTasks(Number(e.target.value))}
                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">KI Automatisierungsgrad (%)</label>
              <input type="number" value={aiPercent} onChange={(e) => setAiPercent(Number(e.target.value))}
                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" min="0" max="100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Arbeitsstunden pro Tag</label>
              <input type="number" value={hoursPerDay} onChange={(e) => setHoursPerDay(Number(e.target.value))}
                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Arbeitstage pro Jahr</label>
              <input type="number" value={daysPerYear} onChange={(e) => setDaysPerYear(Number(e.target.value))}
                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="mt-8 bg-white shadow rounded p-4">
        <h2 className="text-xl font-semibold mb-4 text-green-600">Ergebnisse</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Menschliche Gesamtkosten</p>
            <p className="text-lg font-semibold text-blue-600">${results.humanTotal}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Durch KI abgedeckte Kosten</p>
            <p className="text-lg font-semibold text-green-600">${results.aiCovered}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Verbleibende menschliche Kosten</p>
            <p className="text-lg font-semibold text-red-600">${results.humanRemain}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">KI Gesamtkosten</p>
            <p className="text-lg font-semibold text-purple-600">${results.totalApi}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Gesamteinsparungen</p>
            <p className="text-lg font-semibold text-green-600">${results.savings}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Restliche benötigte Zeit</p>
            <p className="text-lg font-semibold text-orange-600">{results.totalHours} Stunden / {results.totalDays} Tage</p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="mt-8 bg-white shadow rounded p-4">
        <h2 className="text-xl font-semibold mb-4 text-blue-600">Kostenübersicht</h2>
        <div className="h-64 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Kosten" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="container mx-auto p-4 max-w-4xl bg-gray-50">

    
    {/* Summary Section */}
    <Summary results={results} />
    
  </div>
    </div>
  );
};

export default ROICalc;
