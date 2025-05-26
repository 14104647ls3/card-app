import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale,
  LinearScale,

  
  BarElement,
  Title
);

interface QuestionAnswers {
  questionId: string;
  questionLabel: string;
  questionType: string;
  answers: Array<{
    responseId: string;
    questionType: string;
    value: unknown;
    submittedAt: Date;
  }>;
}

interface ResponseChartProps {
  questionData: QuestionAnswers;
  isMobile?: boolean;
}

// Generate colors for charts
const generateColors = (count: number) => {
  const colors = [
    'rgba(59, 130, 246, 0.8)',   // Blue
    'rgba(16, 185, 129, 0.8)',   // Green
    'rgba(245, 158, 11, 0.8)',   // Yellow
    'rgba(239, 68, 68, 0.8)',    // Red
    'rgba(139, 92, 246, 0.8)',   // Purple
    'rgba(236, 72, 153, 0.8)',   // Pink
    'rgba(14, 165, 233, 0.8)',   // Sky
    'rgba(34, 197, 94, 0.8)',    // Emerald
    'rgba(251, 146, 60, 0.8)',   // Orange
    'rgba(168, 85, 247, 0.8)',   // Violet
  ];
  
  return Array.from({ length: count }, (_, i) => colors[i % colors.length]);
};

// Process data for radio questions (pie chart)
const processRadioData = (answers: QuestionAnswers['answers']) => {
  const counts: Record<string, number> = {};
  
  answers.forEach(answer => {
    const value = String(answer.value);
    if (value && value.trim() !== '') {
      counts[value] = (counts[value] || 0) + 1;
    }
  });
  
  const labels = Object.keys(counts);
  const data = Object.values(counts);
  const colors = generateColors(labels.length);
  
  return {
    labels,
    datasets: [{
      label: 'Responses',
      data,
      backgroundColor: colors,
      borderColor: colors.map(color => color.replace('0.8', '1')),
      borderWidth: 2,
    }]
  };
};

// Process data for checkbox questions (bar chart)
const processCheckboxData = (answers: QuestionAnswers['answers']) => {
  const counts: Record<string, number> = {};
  
  answers.forEach(answer => {
    if (Array.isArray(answer.value)) {
      (answer.value as string[]).forEach(option => {
        if (option && option.trim() !== '') {
          counts[option] = (counts[option] || 0) + 1;
        }
      });
    }
  });
  
  const labels = Object.keys(counts);
  const data = Object.values(counts);
  const colors = generateColors(labels.length);
  
  return {
    labels,
    datasets: [{
      label: 'Number of Selections',
      data,
      backgroundColor: colors,
      borderColor: colors.map(color => color.replace('0.8', '1')),
      borderWidth: 2,
    }]
  };
};

export function ResponseChart({ questionData, isMobile = false }: ResponseChartProps) {
  if (!questionData || questionData.answers.length === 0) {
    return null;
  }

  const { questionType, answers } = questionData;

  // Only show charts for radio and checkbox questions
  if (questionType !== 'radio' && questionType !== 'checkbox') {
    return null;
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: isMobile ? ('bottom' as const) : ('right' as const),
        labels: {
          padding: isMobile ? 10 : 20,
          font: {
            size: isMobile ? 10 : 12,
          },
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: unknown) {
            const ctx = context as { label: string; parsed: number; raw: number; dataset: { data: number[] } };
            const label = ctx.label || '';
            const value = ctx.parsed || ctx.raw;
            const total = ctx.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
  };

  const barOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          font: {
            size: isMobile ? 10 : 12,
          },
        },
      },
      x: {
        ticks: {
          font: {
            size: isMobile ? 10 : 12,
          },
          maxRotation: isMobile ? 45 : 0,
        },
      },
    },
  };

  if (questionType === 'radio') {
    const data = processRadioData(answers);
    
    return (
      <div className={`${isMobile ? 'h-64' : 'h-80'} w-full`}>
        <Pie data={data} options={chartOptions} />
      </div>
    );
  }

  if (questionType === 'checkbox') {
    const data = processCheckboxData(answers);
    
    return (
      <div className={`${isMobile ? 'h-64' : 'h-80'} w-full`}>
        <Bar data={data} options={barOptions} />
      </div>
    );
  }

  return null;
}

// Legacy component for backward compatibility
export function ResponseDoughnut({ statistics }: { statistics: unknown }) {
  if (!statistics) return null;
  
  const data = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [{
      label: '# of Votes',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    }],
  };
  
  return (
    <div className="w-full h-full justify-center items-center flex">
      <Pie data={data} />
    </div>
  );
}