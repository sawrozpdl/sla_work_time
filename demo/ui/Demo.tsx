import * as React from 'react';

import './style.css';
import Simulator from './Simulator';

const Demo = () => {
  return (
    <div
      style={{
        height: '100%',
        width: '100%',
      }}
    >
      <div
        style={{
          position: 'relative',
          fontSize: '2rem',
          fontWeight: '700',
          width: '100%',
          textAlign: 'center',
          color: '#5d9199',
          padding: '3vh 0px',
        }}
      >
        SLA WORK TIME [DEMO]
        <span
          style={{
            position: 'absolute',
            top: '6px',
            left: '18px',
            fontSize: '14px',
          }}
        >
          {' '}
          {[
            {
              logo: 'https://cdn-icons-png.flaticon.com/512/25/25231.png',
              link: 'https://github.com/sawrozpdl/sla_work_time',
            },
            {
              logo:
                'https://raw.githubusercontent.com/npm/logos/master/npm%20square/n-64.png',
              link: 'https://www.npmjs.com/package/sla_work_time',
            },
          ].map((conf, key) => (
            <img
              key={key}
              width={22}
              height={22}
              title={conf.link}
              style={{
                cursor: 'pointer',
                marginRight: '8px',
              }}
              src={conf.logo}
              onClick={() => window.open(conf.link)}
            />
          ))}
        </span>
      </div>
      <Simulator />
    </div>
  );
};

export default Demo;
