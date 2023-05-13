import { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import stringify from 'csv-stringify';
import { saveAs } from 'file-saver';

function App() {
  const [data, setData] = useState(null);

  const fetchData = async () => {
    const response = await fetch('https://www.terriblytinytales.com/test.txt');
    const text = await response.text();
    
    // Parse text and find word frequency
    const wordCount = {};
    const words = text.split(/\W+/);
    for (const word of words) {
      if (word) {
        wordCount[word] = (wordCount[word] || 0) + 1;
      }
    }
    
    // Get top 20 words by frequency
    const topWords = Object.entries(wordCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([word, count]) => ({ word, count }));

    // Create chart data
    const chartData = {
      labels: topWords.map(({ word }) => word),
      datasets: [
        {
          label: 'Word frequency',
          data: topWords.map(({ count }) => count),
        },
      ],
    };

    setData(chartData);
  };

  const handleExport = () => {
    if (!data) return;
    
    // Convert chart data to CSV format
    stringify(data.datasets[0].data, (err, output) => {
      if (err) throw err;
      const blob = new Blob([output], { type: 'text/csv;charset=utf-8' });
      saveAs(blob, 'histogram.csv');
    });
  };

  return (
    <div>
      <button onClick={fetchData}>Submit</button>
      {data && <Bar data={data} />}
      {data && <button onClick={handleExport}>Export</button>}
    </div>
  );
}

export default App;
