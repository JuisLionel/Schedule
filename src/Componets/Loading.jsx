import "../Style/Loading.css";

import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';

export default function Loading() {
    const [dots, setDots] = useState('.');

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => (prev.length === 3 ? '.' : prev + '.'));
        }, 500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="Loading">
            <Spin indicator={<LoadingOutlined style={{ fontSize: 48, color: 'white' }} spin />} />
            <h1>Loading{dots}</h1>
        </div>
    );
}
