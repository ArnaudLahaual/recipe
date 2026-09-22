import { forwardRef } from 'react';
import { Checkbox } from 'antd';

// forwardRef est nécessaire : react-to-print cible ce composant via une ref
const PrintableList = forwardRef(({ title, groups }, ref) => (
  <div ref={ref} style={{ padding: 24 }}>
    <style>{`
      @media print {
        .no-print { display: none; }
        body { -webkit-print-color-adjust: exact; }
      }
    `}</style>
    <h2 style={{ fontFamily: 'Georgia, serif' }}>{title}</h2>
    {groups.map((group) => (
      <div key={group.category} style={{ marginBottom: 16 }}>
        <h4 style={{ color: '#a63d2f', borderBottom: '1px solid #eee', paddingBottom: 4 }}>
          {group.category}
        </h4>
        {group.ingredients.map((ing) => (
          <div key={ing.id || ing.name} style={{ padding: '4px 0' }}>
            <Checkbox>
              {ing.name.toUpperCase()} — {ing.scaledQty ?? ing.qty} {ing.unit}
            </Checkbox>
          </div>
        ))}
      </div>
    ))}
  </div>
));

export default PrintableList;
