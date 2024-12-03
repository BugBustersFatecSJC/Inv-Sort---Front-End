import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, LabelList, Tooltip } from 'recharts';
import Label from '../../components/Label/Label';
import Tooltipporcentagem from '../../components/Tooltipporcentagem/Tooltipporcentagem';
import api from '../../services/api';
import SectorButton from '../sectorButton/sectorButton';
import DropdownButtons from '../DropdownButtons/DropdownButtons';
import Loading from '../Loading/Loading';
const COLORS = ['#044687', '#09794E', '#853C22', '#729B23', '#7E3998','#4B5E71'];

const Sectorchart = () => {
  const [selectedValue, setSelectedValue] = useState('2024'); // Default value
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anos, setAnos] = useState([]);
  const handleChange = (event) => {
    const newValue = event?.target?.value || '2024';
    setSelectedValue(newValue);
    console.log("selected", selectedValue);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/sectoranual?ano=' + selectedValue);
        const data = response.data;
        console.log("dados", data);
        setData(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setLoading(true);
      }
    };

    fetchData();
  }, [selectedValue]); // Fetch data whenever selectedValue changes
  console.log(selectedValue,'selected');
  
  useEffect(() => {
    const fetchAnos = async () => {
      try {
        const response = await api.get('/valorantigo');
        const data = response.data;
        console.log("dados", data);
        setAnos(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setLoading(true);
      }
    };

    fetchAnos();
  },[]); // Fetch data whenever selectedValue changes
  
  
  console.log('loading',loading);
  
  if (!loading) {

  return (
    <> <DropdownButtons options={anos} type='ano' label='Ano' onChange={(e) => { setSelectedValue(e.target.value);
      console.log(e.target.value);}} padrao = {false} />
     
    <ResponsiveContainer width={'100%'} height={250} className={'flex   my-auto mx-auto  flex-col justify-between align-center items-center text-center'}>
      
     
      <PieChart className='h-[90%] '>
        <Tooltip content={<Tooltipporcentagem />} />
        <Pie
          data={data}
          cx={`50%`}
          cy={`50%`}
          innerRadius={60}
          outerRadius={100}
          paddingAngle={0}
          dataKey="total_difference"
          stroke="#ffc376"
          strokeWidth={2.5}

 >

          <LabelList dataKey="%" stroke='none'  fill='#ffc376' className='poppins-semibold text-white text-sm' />
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Pie>
      </PieChart>
      <div className='flex flex-wrap w-[100%] px-1/2 pt-2 text-center justify-center'>
        <Label className='border-[#B45105] border-4' data={data} colors={COLORS} />
      </div>
    </ResponsiveContainer>
    </>
  );
}
else {
  <p>Não há dados para a análise</p>
}
};

export default Sectorchart;