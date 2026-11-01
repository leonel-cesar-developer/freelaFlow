"use client";

import { useState } from "react";
import { format, parseISO } from "date-fns";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

import Relatorio from "@/app/components/dashboardRelatorio/Relatorio";
interface Transaction {
  id: string;
  date: string;
  description: string;
  category: "Receita" | "Despesa";
  amount: number;
}

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "1",
    date: "2025-06-01",
    description: "Projeto Site",
    category: "Receita",
    amount: 2500,
  },
  {
    id: "2",
    date: "2025-06-02",
    description: "Licença Figma",
    category: "Despesa",
    amount: 120,
  },
  {
    id: "3",
    date: "2025-06-05",
    description: "App Mobile",
    category: "Receita",
    amount: 3000,
  },
  {
    id: "4",
    date: "2025-06-07",
    description: "Compra de domínio",
    category: "Despesa",
    amount: 20,
  },
  {
    id: "5",
    date: "2025-06-10",
    description: "Manutenção",
    category: "Despesa",
    amount: 1400,
  },
];

const COLORS = ["#22c55e", "#ef4444"];

function FinancasPage() {
  const [filters, setFilters] = useState({
    start: "2025-06-01",
    end: "2025-06-30",
    category: "Todas",
  });

  // Filtro local
  const filtered = MOCK_TRANSACTIONS.filter((tx) => {
    const inRange = tx.date >= filters.start && tx.date <= filters.end;
    const matchCategory =
      filters.category === "Todas" || tx.category === filters.category;
    return inRange && matchCategory;
  });

  const resumo = filtered.reduce(
    (acc, t) => {
      if (t.category === "Receita") acc.receita += t.amount;
      else acc.despesa += t.amount;
      return acc;
    },
    { receita: 0, despesa: 0 }
  );

  const balanco = resumo.receita - resumo.despesa;

  const chartData = [
    { name: "Receita", value: resumo.receita },
    { name: "Despesa", value: resumo.despesa },
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      <h2 className="text-3xl font-bold text-blue-600">Finanças</h2>

      {/* Filtros */}
      <div className="grid gap-4 md:grid-cols-3 sm:grid-cols-2">
        <div>
          <label className="block text-sm text-gray-700">Início</label>
          <input
            type="date"
            value={filters.start}
            onChange={(e) =>
              setFilters((f) => ({ ...f, start: e.target.value }))
            }
            className="mt-1 w-full border px-3 py-2 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700">Fim</label>
          <input
            type="date"
            value={filters.end}
            onChange={(e) => setFilters((f) => ({ ...f, end: e.target.value }))}
            className="mt-1 w-full border px-3 py-2 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700">Categoria</label>
          <select
            value={filters.category}
            onChange={(e) =>
              setFilters((f) => ({ ...f, category: e.target.value }))
            }
            className="mt-1 w-full border px-3 py-2 rounded-md"
          >
            <option>Todas</option>
            <option>Receita</option>
            <option>Despesa</option>
          </select>
        </div>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm text-gray-500">Receita Total</h3>
          <p className="text-2xl font-bold text-green-600 mt-2">
            € {resumo.receita.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm text-gray-500">Despesas</h3>
          <p className="text-2xl font-bold text-red-500 mt-2">
            € {resumo.despesa.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm text-gray-500">Balanço</h3>
          <p className="text-2xl font-bold text-blue-600 mt-2">
            € {balanco.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white p-6 rounded-lg shadow overflow-x-auto">
        <h3 className="text-lg font-semibold mb-4">Transações Recentes</h3>
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-2">Data</th>
              <th className="text-left p-2">Descrição</th>
              <th className="text-left p-2">Categoria</th>
              <th className="text-right p-2">Valor</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((tx) => (
              <tr key={tx.id}>
                <td className="p-2">
                  {format(parseISO(tx.date), "yyyy-MM-dd")}
                </td>
                <td className="p-2">{tx.description}</td>
                <td className="p-2">{tx.category}</td>
                <td
                  className={`p-2 text-right font-semibold ${
                    tx.category === "Receita"
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  € {tx.amount.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow h-64">
          <h4 className="font-semibold mb-2">Distribuição por Categoria</h4>   
          <ResponsiveContainer width="100%" height="80%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                label
              >
                {chartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow h-64">
          <h4 className="font-semibold mb-2">Resumo Financeiro</h4>
          <ResponsiveContainer width="100%" height="80%">
            <BarChart
              data={[
                {
                  name: "Resumo",
                  Receita: resumo.receita,
                  Despesa: resumo.despesa,
                },
              ]}
            >
              <Tooltip />
              <Bar dataKey="Receita" fill="#22c55e" />
              <Bar dataKey="Despesa" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <Relatorio />
    </section>
  );
}

export default FinancasPage;
