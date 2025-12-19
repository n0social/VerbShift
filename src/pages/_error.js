import React from 'react';

function Error({ statusCode, message }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#f8f9fa',
      color: '#212529',
      textAlign: 'center',
    }}>
      <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>
        {statusCode || 'Error'}
      </h1>
      <p style={{ fontSize: '1.5rem' }}>
        {message || 'An unexpected error occurred.'}
      </p>
      <p style={{ marginTop: '1rem', fontSize: '1rem', color: '#6c757d' }}>
        Please check the console or server logs for more details.
      </p>
    </div>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  const message = err ? err.message : null;
  return { statusCode, message };
};

export default Error;