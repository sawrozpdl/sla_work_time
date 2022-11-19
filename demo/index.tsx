import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';

const App = () => {
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
          ].map(conf => (
            <img
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

      <div
        style={{
          height: '100%',
          width: '100%',
          textAlign: 'center',
          fontSize: '28px',
        }}
      >
        {'Work in progress!'}
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(<App />);
