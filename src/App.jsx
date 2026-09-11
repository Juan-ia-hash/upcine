import { useMemo, useState } from 'react'
import poster from '../imagenes/cartel.jpeg'
import hero from '../imagenes/horizontal.jpeg'

const movie = {
  title: 'La ciudad y los perros', genre: 'Drama', year: '1985', duration: '2 h 10 min', rating: '+14',
  time: '7:00 p.m.', place: 'Auditorio de la Universidad', price: 15,
  synopsis: 'Un grupo de cadetes en una academia militar enfrenta la brutalidad, la corrupción y la lucha por el poder en un ambiente de violencia y humillación. Basada en la novela de Mario Vargas Llosa.'
}
const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
const occupied = new Set(['A2', 'A7', 'B4', 'C3', 'C8', 'D2', 'D8', 'E5', 'F2', 'F8', 'G4', 'H6'])
const makeCode = () => `UPC-${Math.random().toString(36).slice(2, 7).toUpperCase()}`

function Header({ go, showNotice }) {
  const [open, setOpen] = useState(false)
  const navigate = (page) => { go(page); setOpen(false) }
  return <header className="header">
    <button className="brand" onClick={() => navigate('movies')} aria-label="Ir a la cartelera de UPCINE"><i>✦</i>UPCINE</button>
    <button className="menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Abrir menú">☰</button>
    <nav className={open ? 'nav open' : 'nav'}>
      <button onClick={() => navigate('movies')}>Inicio</button><button onClick={() => navigate('detail')}>Película</button>
      <button onClick={() => showNotice('En UPCINE eliges tu asiento y recibes tu código de reserva al instante.')}>Cómo funciona</button>
      <button onClick={() => showNotice('¿Tienes consultas? Escríbenos a hola@upcine.demo')}>Contacto</button>
      <div className="mobile-account"><button onClick={() => showNotice('El inicio de sesión estará disponible en la versión completa.')}>Iniciar sesión</button><button className="outline small" onClick={() => showNotice('El registro estará disponible en la versión completa.')}>Registrarse</button></div>
    </nav>
    <div className="account"><button onClick={() => showNotice('El inicio de sesión estará disponible en la versión completa.')}>Iniciar sesión</button><button className="outline small" onClick={() => showNotice('El registro estará disponible en la versión completa.')}>Registrarse</button></div>
  </header>
}

function Chip({ children }) { return <span className="chip">{children}</span> }
function MovieMeta() { return <div className="meta"><Chip>{movie.genre}</Chip><span>{movie.year}</span><span>{movie.duration}</span><strong>{movie.rating}</strong></div> }
function PrimaryButton({ children, ...props }) { return <button className="primary" {...props}>{children} <span aria-hidden="true">→</span></button> }

function MovieCard({ go }) { return <article className="movie-card"><img src={poster} alt={'Cartel de ' + movie.title}/><div className="movie-card-body"><p className="eyebrow">EN CARTELERA</p><h2>{movie.title}</h2><MovieMeta/><p>Una historia inolvidable sobre la juventud, el poder y la lealtad.</p><PrimaryButton onClick={() => go('detail')}>Ver película</PrimaryButton></div></article> }

function Seats({ selected, toggle }) { return <section className="seats-section"><div className="screen">PANTALLA <span></span></div><div className="seat-grid" role="group" aria-label="Mapa de asientos">
  {rows.map(row => <div className="seat-row" key={row}><span className="row-label">{row}</span>{Array.from({ length: 10 }, (_, index) => { const id = `${row}${index + 1}`; const isOccupied = occupied.has(id); const active = selected.includes(id); return <button key={id} className={`seat ${isOccupied ? 'occupied' : active ? 'selected' : ''}`} disabled={isOccupied} onClick={() => toggle(id)} aria-pressed={active} aria-label={`Asiento ${id}, ${isOccupied ? 'ocupado' : active ? 'seleccionado' : 'disponible'}`}><span>{index + 1}</span></button> })}<span className="row-label">{row}</span></div>)}
  </div><div className="legend" aria-label="Leyenda"><span><i className="legend-seat available"></i>Disponible</span><span><i className="legend-seat picked"></i>Seleccionado</span><span><i className="legend-seat taken"></i>Ocupado</span></div></section> }

function Summary({ selected, go, confirm, validation }) { const total = selected.length * movie.price; return <aside className="summary"><h2>Tu reserva</h2><div className="summary-movie"><img src={poster} alt=""/><div><h3>{movie.title}</h3><p>{movie.time}</p><p>{movie.place}</p></div></div><dl><div><dt>Asientos</dt><dd>{selected.length ? selected.join(', ') : 'Aún no has elegido'}</dd></div><div><dt>Entradas</dt><dd>{selected.length}</dd></div><div><dt>Precio por entrada</dt><dd>S/ {movie.price.toFixed(2)}</dd></div></dl><div className="total"><span>Total</span><strong>S/ {total.toFixed(2)}</strong></div>{validation && <p className="validation" role="alert">Selecciona al menos un asiento para continuar.</p>}<PrimaryButton onClick={confirm}>Confirmar reserva</PrimaryButton><button className="cancel" onClick={() => go('detail')}>Cancelar</button></aside> }

function QR() { const cells = Array.from({ length: 121 }, (_, i) => ((i * 17 + i * i * 3 + 7) % 11 < 5)); return <div className="qr" aria-label="Código QR de la reserva">{cells.map((on, i) => <i key={i} className={on ? 'dark' : ''}/>)}</div> }

export default function App() {
  const [page, setPage] = useState('welcome'); const [selected, setSelected] = useState(['D6', 'F5']); const [notice, setNotice] = useState(''); const [validation, setValidation] = useState(false); const [reservation, setReservation] = useState(null)
  const go = (next) => { setPage(next); setValidation(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const toggle = (seat) => { setSelected(s => s.includes(seat) ? s.filter(x => x !== seat) : [...s, seat].sort((a,b) => a.localeCompare(b))); setValidation(false) }
  const confirm = () => { if (!selected.length) { setValidation(true); return } setReservation({ seats: selected, code: makeCode() }); go('confirmation') }
  const showNotice = (message) => { setNotice(message); setTimeout(() => setNotice(''), 3500) }
  const total = useMemo(() => (reservation?.seats.length || 0) * movie.price, [reservation])
  if (page === 'welcome') return <main className="welcome"><div className="welcome-top"><button className="brand" onClick={() => go('movies')}><i>✦</i>UPCINE</button><span>DEMO DE RESERVAS</span></div><div className="welcome-content"><p className="eyebrow">BIENVENIDO A UPCINE</p><h1>Tu próxima historia<br/><em>empieza aquí.</em></h1><p>Una experiencia de cine simple, cercana y hecha para disfrutar.</p><PrimaryButton onClick={() => go('movies')}>Entrar</PrimaryButton></div><div className="ticket-art" aria-hidden="true"><span>UPCINE</span><b>✦</b><small>ADMIT ONE<br/>CINEMA EXPERIENCE</small></div></main>
  return <><Header go={go} showNotice={showNotice}/>{notice && <div className="toast" role="status">{notice}</div>}<main className="app-main">
    {page === 'movies' && <section className="movies-page"><div className="intro"><p className="eyebrow">CARTELERA</p><h1>Una película.<br/><em>Una gran historia.</em></h1><p>Disfruta una función especial en el Auditorio de la Universidad.</p></div><MovieCard go={go}/></section>}
    {page === 'detail' && <section className="detail-page"><button className="back" onClick={() => go('movies')}>← Volver a cartelera</button><div className="detail-hero"><img src={hero} alt="Cadetes en formación de La ciudad y los perros"/><div><p className="eyebrow">FUNCIÓN ESPECIAL</p><h1>{movie.title}</h1><MovieMeta/><p className="synopsis">{movie.synopsis}</p></div></div><div className="function-card"><div><p className="eyebrow">FUNCIÓN</p><h2>{movie.time}</h2><p>{movie.place}</p></div><div className="price-note"><span>Entrada general</span><strong>S/ 15.00</strong></div><PrimaryButton onClick={() => go('seats')}>Reservar mi asiento</PrimaryButton></div></section>}
    {page === 'seats' && <section className="reservation-page"><div className="reservation-heading"><button className="back" onClick={() => go('detail')}>← Volver a la película</button><p className="eyebrow">PASO 1 DE 2</p><h1>Selecciona tu asiento</h1><p>Elige los asientos que deseas reservar.</p></div><div className="reservation-layout"><Seats selected={selected} toggle={toggle}/><Summary selected={selected} go={go} confirm={confirm} validation={validation}/></div></section>}
    {page === 'confirmation' && reservation && <section className="confirmation"><div className="check">✓</div><p className="eyebrow">RESERVA COMPLETADA</p><h1>Reserva confirmada</h1><p className="thanks">¡Gracias por elegir UPCINE! Guarda tu código para ingresar a la función.</p><div className="confirmation-card"><div className="confirmation-info"><img src={poster} alt="Cartel de La ciudad y los perros"/><div><h2>{movie.title}</h2><p>{movie.time} · {movie.place}</p><p><b>Asientos:</b> {reservation.seats.join(', ')}</p><p><b>Total:</b> S/ {total.toFixed(2)}</p></div></div><div className="code"><QR/><div><span>CÓDIGO DE RESERVA</span><strong>{reservation.code}</strong><small>Preséntalo al ingresar.</small></div></div></div><div className="confirmation-actions"><PrimaryButton onClick={() => go('movies')}>Volver al inicio</PrimaryButton><button className="outline" onClick={() => showNotice(`Tu reserva ${reservation.code} está activa.`)}>Ver mi reserva</button></div></section>}
  </main></>
}
