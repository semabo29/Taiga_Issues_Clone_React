import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';

const UserProfile = ({ userId, onBack, onShowNotification }) => {
  const { getUserNameById } = useContext(UserContext);
  return (
    <div className="panel" style={{ marginTop: '20px' }}>
      {/* Botón de volver */}
      <button className="btn" onClick={onBack} style={{ marginBottom: '20px' }}>
        &larr; Volver
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '30px' }}>
        
        {/* COLUMNA IZQUIERDA: Sidebar del Perfil */}
        <div style={{ borderRight: '1px solid #ddd', paddingRight: '20px' }}>
          <div style={{ 
            width: '80px', height: '80px', borderRadius: '50%', 
            background: '#00b19d', color: 'white', display: 'flex', 
            alignItems: 'center', justifyContent: 'center', 
            fontSize: '32px', fontWeight: 'bold', marginBottom: '15px' 
          }}>
            {/* Inicial del usuario temporal */}
            {getUserNameById(userId).charAt(0).toUpperCase()}
          </div>
          <h2 style={{ margin: '0 0 5px 0' }}>{getUserNameById(userId)}</h2>
          <p style={{ color: '#888', fontSize: '14px' }}>ID del Usuario: {userId}</p>
        </div>

        {/* COLUMNA DERECHA: Aquí irán las pestañas más adelante */}
        <div>
          <h3>Contenido del Perfil</h3>
          <p style={{ color: '#666' }}>
            Las pestañas de incidencias asignadas, observadas y comentarios irán aquí.
          </p>
        </div>

      </div>
    </div>
  );
};

export default UserProfile;