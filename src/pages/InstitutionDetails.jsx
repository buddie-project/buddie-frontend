import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../style/InstitutionDetails.css";

function InstitutionDetails() {
    const { id } = useParams();
    const [institution, setInstitution] = useState(null);

    useEffect(() => {

        axios.get(`http://localhost:8080/api/institution/${id}`)
            .then((res) => {
                setInstitution(res.data);
            })
            .catch((err) => {
                console.error("Erro ao procurar detalhes da instituição:", err);
                setInstitution(null);
            });
    }, [id]);


    if (!institution) {
        return <div className="loading">A carregar detalhes da instituição ou instituição não encontrada...</div>;
    }

    return (
        <>
            <div className="institution-detail-container">
                <h1 className="institution-title">{institution.nomeIes}</h1>
                <h2 className="institution-subtitle">{institution.unidadeOrganica}</h2>

                <div className="institution-info-box">
                    <div className="left-column">
                        <p><strong>Tipo de Ensino:</strong> {institution.tipoEnsino}</p>
                        <p><strong>Natureza:</strong> {institution.natureza}</p>
                        <p><strong>Morada:</strong> {institution.morada}</p>
                        <p><strong>Código Postal:</strong> {institution.codigoPostal}</p>
                        <p><strong>Distrito:</strong> {institution.distrito}</p>
                    </div>
                    <div className="right-column">
                        <p><strong>Telefone:</strong> {institution.telefone}</p>
                        <p>
                            <strong>Site:</strong>{" "}
                            <a href={institution.site} target="_blank" rel="noopener noreferrer">
                                {institution.site}
                            </a>
                        </p>
                        {institution.googleMapsUrl && (
                            <div className="map-container">
                                <p><strong>Localização:</strong></p>
                                <iframe
                                    title="Google Map of Institution"
                                    src={institution.googleMapsUrl}
                                    width="100%"
                                    height="250"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default InstitutionDetails;