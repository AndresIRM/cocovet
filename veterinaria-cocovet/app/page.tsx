import styles from "./page.module.css";

export default function HomePage() {
  const vetPhotos = [
    "/clientes/Vet1.png",
    "/veterinaria/Vet2.jpg",
    "/veterinaria/Vet3.jpg",
  ];

  const clientPhotos = [
    "/clientes/Cliente1.jpg",
    "/clientes/Candy.jpg",
    "/clientes/Oso.jpg",
    "/clientes/Moana.png",
    "/clientes/Bruma.jpg",
    "/clientes/Syrax.jpg",
    "/clientes/camila.jpg",
    "/clientes/Ratanael.jpg",
    "/clientes/Deyis.jpg",
  ];

  const services = [
    {
      title: "Consulta general",
      description:
        "Revisión médica, diagnóstico y seguimiento para el bienestar de tu mascota.",
    },
    {
      title: "Vacunación",
      description:
        "Esquemas preventivos y aplicación de vacunas para perros y gatos.",
    },
    {
      title: "Hospitalización",
      description:
        "Cuidado médico especializado para mascotas que necesitan atención continua.",
    },
    {
      title: "Urgencias",
      description:
        "Atención rápida en casos que requieren valoración inmediata.",
    },
    {
      title: "Desparasitación",
      description:
        "Tratamientos preventivos para proteger la salud de tu mascota.",
    },
    {
      title: "Cirugías",
      description:
        "Procedimientos realizados con cuidado, seguimiento y atención profesional.",
    },
  ];

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.headerInner}>
            <a href="#" className={styles.brand}>
              <img
                src="/logos/logo.PNG"
                alt="CocoVet"
                className={styles.logo}
              />
              <div>
                <p className={styles.brandTitle}>CocoVet</p>
                <p className={styles.brandSubtitle}>Hospital Veterinario</p>
              </div>
            </a>

            <nav className={styles.nav}>
              <a href="#conocenos">Conócenos</a>
              <a href="#ubicacion">Ubicación</a>
              <a href="#servicios">Servicios</a>
              <a href="#clientes">Clientes</a>
            </nav>

            <a href="/citas" className={styles.ctaButton}>
              Agenda tu cita
            </a>
          </div>
        </div>
      </header>

      <section className={styles.heroSection}>
        <div className={styles.container}>
          <div className={styles.heroCard}>
            <div className={styles.heroContent}>
              <span className={styles.badge}>Atención con calidez y confianza</span>
              <h1 className={styles.heroTitle}>
                Porque sabemos que tu mascota es parte de tu familia
              </h1>
              <p className={styles.heroText}>
                En CocoVet encontrarás atención veterinaria profesional,
                espacios cómodos para que cada visita se sienta
                segura, tranquila y confiable.
              </p>

              <div className={styles.heroActions}>
                <a href="/citas" className={styles.primaryButton}>
                  Agenda tu cita
                </a>
                <a href="#servicios" className={styles.secondaryButton}>
                  Ver servicios
                </a>
              </div>
            </div>

            <div className={styles.heroImageWrap}>
              <img
                src={vetPhotos[0]}
                alt="Veterinaria"
                className={styles.heroImage}
              />
            </div>
          </div>
        </div>
      </section>

      <section id="conocenos" className={styles.section}>
        <div className={styles.container}>
          <div className={styles.gridTwo}>
            <div className={styles.card}>
              <span className={styles.badgePink}>Conócenos</span>
              <h2 className={styles.sectionTitle}>
                Somos una veterianaria comprometida con la salud y bienestar de tus mascotas
              </h2>
              <p className={styles.sectionText}>
                Nuestra prioridad es la salud, prevención y recuperación de tus mascotas. Nuestro objetivo es
                brindar atención médica de calidad en un ambiente cálido y
                confiable.
              </p>

            </div>

            <div className={styles.photoColumn}>
              <div className={styles.cardImage}>
                <img
                  src={vetPhotos[1]}
                  alt="Instalaciones"
                  className={styles.sectionImageLarge}
                />
              </div>

              <div className={styles.photoRow}>
                <div className={styles.cardImage}>
                  <img
                    src={vetPhotos[2]}
                    alt="Atención veterinaria"
                    className={styles.sectionImageSmall}
                  />
                </div>

                <div className={styles.highlightCard}>
                  <p className={styles.highlightLabel}>Atención integral</p>
                  <h3 className={styles.highlightTitle}>
                    Salud, prevención y cuidado
                  </h3>
                  <p className={styles.highlightText}>
                    Resalta aquí tus diferenciales, especialidades, experiencia o
                    confianza de tus clientes.
                  </p>
                  <a href="/citas" className={styles.pinkButton}>
                    Reservar cita
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="ubicacion" className={styles.section}>
        <div className={styles.container}>
          <div className={styles.gridLocation}>
            <div className={styles.card}>
              <span className={styles.badge}>Ubicación</span>
              <h2 className={styles.sectionTitle}>Visítanos en nuestra sucursal</h2>
              <p className={styles.sectionText}>
                Nos ubicamos en:
              </p>

              <div className={styles.infoList}>
                <p>
                  <strong>Dirección:</strong> Francisco Villa 2, La Asención, 50455, Atlacomulco de Fabela, Méx.
                </p>
                <p>
                  <strong>Horario:</strong> Lunes a viernes · 9:30 AM a 7:00 PM, Sábados · 10:00 AM a 4:00 PM
                </p>
                <p>
                  <strong>Teléfono:</strong> 712 280 4543 - 712 597 5788
                </p>
              </div>

              <a
                href="https://maps.app.goo.gl/Lbb5VmPnKAVb29VX8"
                target="_blank"
                rel="noreferrer"
                className={styles.pinkButton}
              >
                Ver en Google Maps
              </a>
            </div>

            <div className={styles.mapCard}>
              <iframe
                title="Mapa veterinaria"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3754.034229994971!2d-99.8793316889043!3d19.796145981485544!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d2591cac4923d7%3A0x30d53c2fe793bade!2sCocovet!5e0!3m2!1ses!2smx!4v1773000624868!5m2!1ses!2smx"
                className={styles.map}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="servicios" className={styles.section}>
        <div className={styles.container}>
          <div className={styles.card}>
            <span className={styles.badgePink}>Servicios</span>
            <h2 className={styles.sectionTitle}>
              Servicios veterinarios en un formato claro y ordenado
            </h2>
            <p className={styles.sectionText}>
              Presenta aquí los principales servicios de la clínica con tarjetas
              rectangulares, limpias y con buen espacio.
            </p>

            <div className={styles.servicesGrid}>
              {services.map((service) => (
                <article key={service.title} className={styles.serviceCard}>
                  <div className={styles.serviceBar} />
                  <h3 className={styles.serviceTitle}>{service.title}</h3>
                  <p className={styles.serviceText}>{service.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.ctaCard}>
            <div>
              <p className={styles.ctaLabel}>Agenda tu cita</p>
              <h2 className={styles.ctaTitle}>
                Reserva una consulta de forma rápida y sencilla
              </h2>
              <p className={styles.ctaText}>
                Agenda tu cita en el horario que mas se te acomode, sin llamadas ni complicaciones. Nuestro sistema de reservas en línea te permite elegir el servicio, fecha y hora que mejor se adapten a tus necesidades y las de tu mascota.
              </p>
            </div>

            <a href="/citas" className={styles.ctaWhiteButton}>
              Ir a agendar cita
            </a>
          </div>
        </div>
      </section>

      <section id="clientes" className={styles.sectionLast}>
        <div className={styles.container}>
          <div className={styles.card}>
            <span className={styles.badge}>Clientes felices</span>
            <h2 className={styles.sectionTitle}>
              Pacientes y amigos de CocoVet
            </h2>

            <div className={styles.carousel}>
              <div className={styles.carouselTrack}>
                {[...clientPhotos, ...clientPhotos].map((photo, index) => (
                  <div key={`${photo}-${index}`} className={styles.carouselItem}>
                    <img
                      src={photo}
                      alt={`Cliente ${index + 1}`}
                      className={styles.carouselImage}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerInner}>
            <div className={styles.footerBrand}>
              <img
                src="/logos/logo.PNG"
                alt="COCO VET"
                className={styles.footerLogo}
              />
              <span>© 2026 AIRM. Todos los derechos reservados.</span>
            </div>

            <div className={styles.footerLinks}>
              <a href="#conocenos">Conócenos</a>
              <a href="#ubicacion">Ubicación</a>
              <a href="#servicios">Servicios</a>
              <a href="/citas">Agenda tu cita</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}