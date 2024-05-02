import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import  pdfLogo  from './assets/pdf-logo.png'
import axios from 'axios';
import './App.css'

function App() {
  const [files, setFiles] = useState([]);

  const Success = (message) => {
    toast.success(message);
  };

  const Error = (message) => {
    toast.error(message);
  };
  const onDrop = useCallback((acceptedFiles) => {
    setFiles(
      acceptedFiles.map(file =>
        Object.assign(file, {
          preview: URL.createObjectURL(file)
        })
      )
    );
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: '.pdf'
  });

  const onSaveFile = async () => {
    if (files.length === 0) {
      Error('No se ha seleccionado ningún archivo.');
      return;
    }

    const formData = new FormData();
    formData.append('archivo', files[0]);

    try {
      //await axios.post('https://661ef13c73bf918890b43102--startling-gumdrop-5d4913.netlify.app/.netlify/functions/app/upload', formData); 
      await axios.post('http://localhost:3000/upload', formData); 
      Success('Archivo subido y guardado correctamente.');
    } catch (error) {
      Error('Error al subir el archivo.');
      console.error(error);
    }
  };

  const thumbs = files.map(file => (
    <div key={file.name} className="file-item">
        <img src={pdfLogo} alt={file.name} />
        <span>{file.name} - {file.size} bytes</span>
    </div>
  ));

  return (
      <div className="card-upload">
        <h2>Subir Catálogo</h2>
        <div className="drop-zone" {...getRootProps()}>
          <input {...getInputProps()} />
          <p>Arrastra y suelta archivos aquí, o haz clic para seleccionar archivos</p>
        </div>
        <div>{thumbs}</div>
        {
          thumbs.length > 0 &&
          <button className="btn" onClick={onSaveFile}>
            Generar Código QR
          </button>
        }
        <ToastContainer />
      </div>
  )
}

export default App
