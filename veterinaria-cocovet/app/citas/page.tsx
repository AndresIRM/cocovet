"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./citas.module.css";

type Service = {
  id: number;
  name: string;
  price: number;
};

type PetType = {
  id: number;
  type: string;
};

export default function CitasPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [petTypes, setPetTypes] = useState<PetType[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    ownerName: "",
    phone: "",
    email: "",
    petName: "",
    petTypeId: "",
    serviceId: "",
  });

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [servicesRes, petTypesRes] = await Promise.all([
          fetch("/api/services"),
          fetch("/api/pet-types"),
        ]);

        const [servicesData, petTypesData] = await Promise.all([
          servicesRes.json(),
          petTypesRes.json(),
        ]);

        setServices(Array.isArray(servicesData) ? servicesData : []);
        setPetTypes(Array.isArray(petTypesData) ? petTypesData : []);
      } catch (error) {
        console.error(error);
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    const loadSlots = async () => {
      if (!selectedDate) {
        setSlots([]);
        setSelectedTime("");
        return;
      }

      setLoadingSlots(true);
      setSelectedTime("");

      try {
        const res = await fetch(`/api/appointments/slots?date=${selectedDate}`);
        const data = await res.json();
        setSlots(Array.isArray(data?.slots) ? data.slots : []);
      } catch (error) {
        console.error(error);
        setSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };

    loadSlots();
  }, [selectedDate]);

  const selectedService = useMemo(() => {
    return services.find((s) => String(s.id) === form.serviceId);
  }, [services, form.serviceId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!selectedDate || !selectedTime) {
      setMessage("Selecciona una fecha y un horario disponible.");
      return;
    }

    setSending(true);

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          petTypeId: Number(form.petTypeId),
          serviceId: Number(form.serviceId),
          date: selectedDate,
          time: selectedTime,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data?.error ?? "No se pudo crear la cita");
        return;
      }

      setMessage("La cita fue agendada correctamente. Revisa tu correo para más detalles. Puede encontrarse en la bandeja de no deseados.");

      setForm({
        ownerName: "",
        phone: "",
        email: "",
        petName: "",
        petTypeId: "",
        serviceId: "",
      });
      setSelectedTime("");

      const slotsRes = await fetch(`/api/appointments/slots?date=${selectedDate}`);
      const slotsData = await slotsRes.json();
      setSlots(Array.isArray(slotsData?.slots) ? slotsData.slots : []);
    } catch (error) {
      console.error(error);
      setMessage("Ocurrió un error al crear la cita.");
    } finally {
      setSending(false);
    }
  };

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.headerInner}>
            <a href="/" className={styles.brand}>
              <img
                src="/logos/logo.PNG"
                alt="COCO VET"
                className={styles.logo}
              />
              <div>
                <p className={styles.brandTitle}>COCO VET</p>
                <p className={styles.brandSubtitle}>Hospital Veterinario</p>
              </div>
            </a>

            <a href="/" className={styles.backButton}>
              Volver al inicio
            </a>
          </div>
        </div>
      </header>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.layout}>
            <aside className={styles.sidebar}>
              <div className={styles.card}>
                <span className={styles.badge}>Horarios disponibles</span>
                <h2 className={styles.cardTitle}>Selecciona un horario</h2>
                <p className={styles.cardText}>
                  Elige una fecha y aquí aparecerán los horarios disponibles.
                </p>

                <div className={styles.calendarBox}>
                  <label className={styles.label}>Fecha</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className={styles.input}
                  />
                </div>

                <div className={styles.slotsBox}>
                  {loadingSlots ? (
                    <p className={styles.emptyState}>Cargando horarios...</p>
                  ) : !selectedDate ? (
                    <p className={styles.emptyState}>
                      Selecciona una fecha para ver horarios.
                    </p>
                  ) : slots.length === 0 ? (
                    <p className={styles.emptyState}>
                      No hay horarios disponibles para ese día.
                    </p>
                  ) : (
                    <div className={styles.slotsGrid}>
                      {slots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedTime(slot)}
                          className={`${styles.slotButton} ${
                            selectedTime === slot ? styles.slotButtonActive : ""
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </aside>

            <section className={styles.content}>
              <div className={styles.card}>
                <span className={styles.badgePink}>Agenda tu cita</span>
                <h1 className={styles.title}>
                  Reserva una consulta para tu mascota
                </h1>
                <p className={styles.text}>
                  Cada cita dura una hora. El horario disponible depende del día
                  seleccionado y de las citas ya registradas.
                </p>

                <form className={styles.form} onSubmit={handleSubmit}>
                  <div className={styles.grid}>
                    <div className={styles.field}>
                      <label className={styles.label}>Nombre del dueño</label>
                      <input
                        name="ownerName"
                        value={form.ownerName}
                        onChange={handleChange}
                        className={styles.input}
                        placeholder="Nombre completo"
                      />
                    </div>

                    <div className={styles.field}>
                      <label className={styles.label}>Teléfono</label>
                      <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className={styles.input}
                        placeholder="5512345678"
                      />
                    </div>

                    <div className={styles.field}>
                      <label className={styles.label}>Correo</label>
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        className={styles.input}
                        placeholder="correo@ejemplo.com"
                      />
                    </div>

                    <div className={styles.field}>
                      <label className={styles.label}>Nombre de la mascota</label>
                      <input
                        name="petName"
                        value={form.petName}
                        onChange={handleChange}
                        className={styles.input}
                        placeholder="Firulais"
                      />
                    </div>

                    <div className={styles.field}>
                      <label className={styles.label}>Tipo de mascota</label>
                      <select
                        name="petTypeId"
                        value={form.petTypeId}
                        onChange={handleChange}
                        className={styles.input}
                      >
                        <option value="">Selecciona una opción</option>
                        {petTypes.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.type}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className={styles.field}>
                      <label className={styles.label}>Servicio</label>
                      <select
                        name="serviceId"
                        value={form.serviceId}
                        onChange={handleChange}
                        className={styles.input}
                      >
                        <option value="">Selecciona un servicio</option>
                        {services.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name} 
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className={styles.summary}>
                    <div>
                      <p className={styles.summaryLabel}>Fecha seleccionada</p>
                      <p className={styles.summaryValue}>
                        {selectedDate || "Sin seleccionar"}
                      </p>
                    </div>

                    <div>
                      <p className={styles.summaryLabel}>Horario seleccionado</p>
                      <p className={styles.summaryValue}>
                        {selectedTime || "Sin seleccionar"}
                      </p>
                    </div>

                    <div>
                      <p className={styles.summaryLabel}>Servicio</p>
                      <p className={styles.summaryValue}>
                        {selectedService
                          ? `${selectedService.name} `
                          : "Sin seleccionar"}
                      </p>
                    </div>
                  </div>

                  {message ? <p className={styles.message}>{message}</p> : null}

                  <div className={styles.actions}>
                    <button
                      type="submit"
                      disabled={sending}
                      className={styles.submitButton}
                    >
                      {sending ? "Agendando..." : "Confirmar cita"}
                    </button>
                  </div>
                </form>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}