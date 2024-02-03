import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';
import { Tooltip } from 'antd';

const COLORS = ['#0088FE', '#00C49F'];

const PieComponent = () => {
  const [data, setData] = useState([
    { name: 'Online Customer', value: 0 },
    { name: 'Onsite Customer', value: 0 },
  ]);

  const [chartDimensions, setChartDimensions] = useState({
    width: 200,
    height: 300,
    outerRadius: 95,
  });

  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseOnline = await axios.get('/api/new/today');
        const responseOnsite = await axios.get('/api/add/today');

        const { count: onlineCount } = responseOnline.data;
        const { count: onsiteCount } = responseOnsite.data;

        // Update both values in the data array
        setData([
          { ...data[0], value: onlineCount },
          { ...data[1], value: onsiteCount },
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const handleResize = () => {
      // ... (same as your existing code)
    };

    fetchData();
    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [data]);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  return (
    <div className='flex flex-col gap-0 items-center justify-center'>
      <PieChart width={chartDimensions.width} height={chartDimensions.height}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={chartDimensions.outerRadius}
          fill="#8884d8"
          dataKey="value"
          onMouseEnter={onPieEnter}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={index === activeIndex ? COLORS[index % COLORS.length] : '#8884d8'}
            />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
      <div className='grid grid-cols-2 text-center gap-10'>
        {data.map((item, index) => (
          <p
            key={`label-${index}`}
            className={`cursor-pointer font-bold ${index === activeIndex ? 'text-blue-600' : ''}`}
          >
            {item.name}: {item.value}
          </p>
        ))}
      </div>
    </div>
  );
};

export default PieComponent;
