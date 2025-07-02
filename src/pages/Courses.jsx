import "../style/Courses.css";

function Courses() {


    return(
        <>
            <div className="filters">
                <div className="filters-box">
                    <select>
                        <option>curso</option>
                        <option>design</option>
                        <option>bioquimica</option>
                    </select>
                    <select>
                        <option>instituição</option>
                        <option>ISCTE</option>
                        <option>FBAUL</option>
                    </select>
                    <select>
                        <option>area</option>
                        <option>artes</option>
                        <option>ciências</option>
                    </select>
                    <select>
                    <option>distrito</option>
                    <option>Lisboa</option>
                    <option>Beja</option>
                </select>
                    <select>
                        <option>data</option>
                        <option>2025</option>
                        <option>2026</option>
                    </select>
                </div>
            </div>
            <div className="courses-container">
                <div className="course-card red">
                    <h3>licenciatura</h3>
                    <h5>Design de moda</h5>
                    <p>faculdade de arquitetura da universidade de Lisboa, FAUL</p>
                </div>
                <div className="course-card purple">
                    <h3>pós-graduação</h3>
                    <h5>design de produto</h5>
                    <p>universidade IADE</p>
                </div>
                <div className="course-card orange">
                    <h3>CESPU</h3>
                    <h5>ux/ui design</h5>
                    <p>Atlântica - instituto universitário</p>
                </div>
                <div className="course-card green">
                    <h3>CTeSP</h3>
                    <h5>design de interiores</h5>
                    <p>Escola Superior de Viseu</p>
                </div>
                <div className="course-card yellow">
                    <h3>curso de especialização</h3>
                    <h5>design gráfico</h5>
                    <p>escola de tecnologias
                        inovação e criação, ETIC</p>
                </div>
                <div className="course-card blue">
                    <h3>upskill</h3>
                    <h5>design multimédia</h5>
                    <p>universidade da Beira Interior</p>
                </div>
            </div>

        </>
    )
}

export default Courses;