import '../../style/Profile.css';

function Profile() {

    return (
        <>
            <section className="cards">
                <div className="container-card-one">
                    <h2 className="card-one-title">área pessoal</h2>
                    <div className="card-one">
                       <div className="profile-menu">
                           <p><i className="icon-user" aria-hidden="true"></i>Conta</p>
                           <p><i className="icon-star" aria-hidden="true"></i>Favoritos</p>
                           <p><i className="icon-bookmark" aria-hidden="true"></i>Ver mais tarde</p>
                           <p><i className="icon-bell" aria-hidden="true"></i>Notificações</p>
                           <p><i className="icon-interactions" aria-hidden="true"></i>Interações</p>
                           <p><i className="icon-calendar" aria-hidden="true"></i>Calendário</p>
                           <p><i className="icon-config" aria-hidden="true"></i>Configurações</p>


                           <div className="logout">
                           <p><i className="icon-logout" aria-hidden="true"></i>Terminar Sessão</p>
                           </div>
                       </div>
                    </div>
                </div>
                <div className="container-card-two">
                    <h2 className="card-two-title">Conta</h2>
                    <div className="card-two"></div>
                </div>
            </section>
        </>
    );
}

export default Profile;