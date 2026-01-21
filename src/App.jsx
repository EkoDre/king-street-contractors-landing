import React from 'react'

function ImageWithFallback({ className, alt, primary }){
	// Build candidate list: public paths plus any src/ assets matching pattern
	const assetMatches = import.meta.glob('/src/**/*king-street-contractors.{jpg,JPG,jpeg,png,PNG}', { eager: true, query: '?url', import: 'default' })
	const ts = import.meta.env.DEV ? `?v=${Date.now()}` : ''
	const assetUrls = Object.values(assetMatches)
	const candidates = [
		primary ? `${primary}${ts}` : null,
		`/king-street-contractors.JPG${ts}`,
		`/king-street-contractors.jpeg${ts}`,
		`/king-street-contractors.png${ts}`,
		`/king-street-contractors.PNG${ts}`,
		...assetUrls,
		`/logo.png${ts}`
	].filter(Boolean)
	const [idx, setIdx] = React.useState(0)
	const src = candidates[idx]
	return (
		<img
			className={className}
			src={src}
			alt={alt}
			onError={() => {
				if (idx < candidates.length - 1) setIdx(idx + 1)
			}}
		/>
	)
}

function App() {
	React.useEffect(() => {
		// Ensure page starts at top on initial load / hard refresh
		window.scrollTo(0, 0)
		// Also handle browser restore from cache
		window.addEventListener('beforeunload', () => {
			window.scrollTo(0, 0)
		})
		return () => {
			window.removeEventListener('beforeunload', () => {
				window.scrollTo(0, 0)
			})
		}
	}, [])
	
	// Also scroll to top on page load/restore
	React.useEffect(() => {
		if (window.history.scrollRestoration) {
			window.history.scrollRestoration = 'manual'
		}
		window.scrollTo(0, 0)
	}, [])
	
	

	return (
		<>
		<div className="page">
			<header className="nav">
				<div className="container nav-inner">
					<nav className="menu">
						<a href="#services">Services</a>
						<a href="#sectors">Sectors</a>
						<a href="#faq">Projects</a>
						<a href="#contact" className="btn btn-sm btn-attention">Get a Quote</a>
					</nav>
				</div>
			</header>

			<main>
				<section className="hero">
					<div className="container hero-inner">
						<div className="hero-copy">
							<p className="eyebrow">Precision. Integrity. Results.</p>
							<h1 className="headline">Your trusted building partner — from blueprint to build.</h1>
							<p>
								Top-rated <strong>general contractor</strong> delivering <strong>residential</strong> and <strong>commercial construction</strong> —
								custom homes, remodels, and large-scale build-outs. Local, licensed, insured.
							</p>
							<div className="hero-cta">
								<a className="btn btn-attention" href="#contact">Free Construction Quote</a>
								<a className="btn btn-secondary" href="#services">Explore Services</a>
							</div>
							<div className="divider" />
						</div>
						<div className="hero-art" aria-hidden>
							<div className="blob" />
							<ImageWithFallback className="hero-crest" primary="/king-street-contractors.png" alt="King Street Contractors crest" />
						</div>
					</div>
				</section>

				<section id="video" className="section video-section">
					<div className="container">
						<video 
							className="hero-video" 
							autoPlay 
							muted 
							playsInline 
							preload="auto"
							onEnded={(e) => {
								const section = e.currentTarget.parentElement.parentElement;
								section.style.transition = 'opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1), max-height 1.2s cubic-bezier(0.4, 0, 0.2, 1), padding 1.2s cubic-bezier(0.4, 0, 0.2, 1), margin 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
								section.style.opacity = '0';
								section.style.maxHeight = '0';
								section.style.padding = '0';
								section.style.margin = '0';
								section.style.overflow = 'hidden';
								setTimeout(() => {
									section.style.display = 'none';
								}, 1200);
							}}
						>
							<source src="/hero-video.mp4?v=1" type="video/mp4" />
							<source src="/hero-video.mov?v=1" type="video/mp4" />
							Your browser does not support the video tag.
						</video>
					</div>
				</section>

				<section id="services" className="section">
					<div className="container">
						<h2 className="section-title">General Construction Services</h2>
						<div className="grid features">
							<div className="card">
								<h3>Residential</h3>
								<p>Kitchen remodel, bathroom renovation, home additions, basement finishing, roofing, siding, flooring, deck & patio builder, luxury home renovation, full home remodeling, custom home design, affordable home renovation.</p>
							</div>
							<div className="card">
								<h3>Commercial</h3>
								<p>Commercial construction company, office build-out, tenant improvement contractor, restaurant & retail construction, warehouse construction, industrial facility build, steel building contractor, commercial remodeling.</p>
							</div>
							<div className="card">
								<h3>Management</h3>
								<p>Construction management, project management construction, construction project management, design build firm, general contracting firm, construction engineering services.</p>
							</div>
							<div className="card">
								<h3>Site Development & Excavation</h3>
								<p>Professional site work including excavation, grading, drainage solutions, retaining walls, and blacktop paving. Complete land preparation and infrastructure services for residential and commercial properties.</p>
							</div>
						</div>
					</div>
				</section>

				<section id="sectors" className="section alt">
					<div className="container">
						<h2 className="section-title">Residential & Commercial Expertise</h2>
						<div className="grid pricing">
							<div className="card">
								<h3>Residential</h3>
								<p className="price">Licensed & Insured</p>
								<p>Trusted local contractors for homeowners ready to invest.</p>
								<a className="btn btn-block" href="#contact">Best Construction Company Near You</a>
							</div>
							<div className="card">
								<h3>Commercial</h3>
								<p className="price">On-Time Delivery</p>
								<p>Industrial construction, office build-outs, retail and hospitality.</p>
								<a className="btn btn-block" href="#contact">Request an Estimate</a>
							</div>
							<div className="card">
								<h3>Innovation</h3>
								<p className="price">Built to Last</p>
								<p>Eco-friendly materials, smart home construction, sustainable solutions.</p>
								<a className="btn btn-block" href="#contact">From Blueprint to Build</a>
							</div>
						</div>
					</div>
				</section>

				<section id="faq" className="section">
					<div className="container">
						<h2 className="section-title">Why Choose Us</h2>
						<div className="faq">
							<details>
								<summary>"Built to last. Designed with care."</summary>
								<p>We don't cut corners — we build them. Excellence from the ground up.</p>
							</details>
							<details>
								<summary>Transparent estimates and project management</summary>
								<p>Reliable general contractor providing clear timelines and budget control.</p>
							</details>
							<details>
								<summary>Financing & long-term value</summary>
								<p>Ask about construction company with financing, sustainable building materials, and modern renovation ideas.</p>
							</details>
						</div>
					</div>
				</section>

				<section className="section contact-info">
					<div className="container">
						<h2 className="section-title" style={{textAlign: 'center', marginBottom: '32px'}}>Get In Touch</h2>
						<div className="contact-grid">
							<a href="https://www.google.com/maps/search/?api=1&query=191+King+St+Building+A+Chappaqua+NY+10514" target="_blank" rel="noopener noreferrer" className="contact-card contact-link">
								<h3>Office</h3>
								<p>191 King St<br/>Building A<br/>Chappaqua, NY 10514<br/>United States</p>
							</a>
							<div className="contact-card">
								<h3>Phone</h3>
								<p><a href="tel:914-215-1176">(914) 215-1176</a></p>
							</div>
							<div className="contact-card">
								<h3>Email</h3>
								<p><a href="mailto:Mete@kingstreetcontractors.com">Mete@kingstreetcontractors.com</a></p>
							</div>
						</div>
					</div>
				</section>

				<section id="contact" className="section contact-form-section">
					<div className="container">
						<div className="form-header">
							<h2>Request a consultation</h2>
							<p>Get started on your project today. We'll respond within 24 hours.</p>
						</div>
						<form
							className="contact-form-new"
							onSubmit={async (e) => {
								e.preventDefault();
								const form = e.target;
								const formData = new FormData(form);
								const data = {
									name: formData.get('name'),
									email: formData.get('email'),
									phone: formData.get('phone'),
									projectType: formData.get('projectType'),
									message: formData.get('message'),
								};

								// Disable submit button
								const submitBtn = form.querySelector('button[type="submit"]');
								const originalText = submitBtn.textContent;
								submitBtn.disabled = true;
								submitBtn.textContent = 'Sending...';

								try {
									const response = await fetch('/api/send-email', {
										method: 'POST',
										headers: {
											'Content-Type': 'application/json',
										},
										body: JSON.stringify(data),
									});

									const result = await response.json();

									if (response.ok) {
										alert('Thank you — your request has been received. We\'ll get back to you soon!');
										form.reset();
									} else {
										alert('Sorry, there was an error sending your message. Please try again or call us directly.');
									}
								} catch (error) {
									console.error('Error:', error);
									alert('Sorry, there was an error sending your message. Please try again or call us directly.');
								} finally {
									submitBtn.disabled = false;
									submitBtn.textContent = originalText;
								}
							}}
						>
							<div className="form-field-new">
								<label htmlFor="name">Name</label>
								<input id="name" name="name" type="text" required placeholder="Enter your name" />
							</div>
							<div className="form-field-new">
								<label htmlFor="email">Email</label>
								<input id="email" name="email" type="email" required placeholder="your.email@example.com" />
							</div>
							<div className="form-field-new">
								<label htmlFor="phone">Phone</label>
								<input id="phone" name="phone" type="tel" placeholder="(914) 215-1176" />
							</div>
							<div className="form-field-new">
								<label htmlFor="projectType">Project type</label>
								<select id="projectType" name="projectType" defaultValue="">
									<option value="">Select project type</option>
									<option value="residential">Residential construction</option>
									<option value="commercial">Commercial / industrial</option>
									<option value="renovation">Renovation / remodeling</option>
									<option value="site">Site development &amp; excavation</option>
									<option value="other">Other</option>
								</select>
							</div>
							<div className="form-field-new">
								<label htmlFor="message">Project details</label>
								<textarea
									id="message"
									name="message"
									rows={5}
									required
									placeholder="Tell us about your project timeline, property type, and what you'd like to build or renovate..."
								/>
							</div>
							<button type="submit" className="form-submit-btn">
								Submit
							</button>
						</form>
					</div>
				</section>
			</main>

			<footer className="footer">
				<div className="container footer-inner">
					<div className="footer-brand">
						<strong>King Street Contractors</strong>
						<p className="muted">191 King St, Bldg A · Chappaqua, NY 10514</p>
					</div>
					<div className="footer-contact">
						<a href="tel:914-215-1176" className="muted">(914) 215-1176</a>
						<a href="mailto:Mete@kingstreetcontractors.com" className="muted">Mete@kingstreetcontractors.com</a>
					</div>
				</div>
				<div className="container footer-bottom">
					<span className="muted">© {new Date().getFullYear()} King Street Contractors. All rights reserved.</span>
					<a href="https://ekomadevpn.com" target="_blank" rel="noopener noreferrer" className="muted" style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
						<img src="/ekomade-labs-logo.png" alt="EkoMade Labs logo" style={{width: '42px', height: '42px', opacity: 0.85}} />
						<span>Powered by EkoMade Labs</span>
					</a>
				</div>
			</footer>
		</div>
		</>
	)
}

export default App


