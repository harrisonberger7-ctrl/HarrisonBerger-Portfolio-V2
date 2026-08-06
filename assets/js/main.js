/*
  GLOBAL SITE BEHAVIOR
  --------------------------------------------------------------------------
  This script handles shared navigation, project data, modal dialogs, and the
  machining slideshows. Content belongs in HTML/JSON; behavior belongs here.
*/

document.addEventListener('DOMContentLoaded', () => {
  /* Write the current year into every footer placeholder on the active page. */
  document
    .querySelectorAll('[id^="year"], #current-year')
    .forEach((element) => {
      element.textContent = new Date().getFullYear();
    });

  /* Find the shared mobile-navigation controls, when the page includes them. */
  const navigation = document.querySelector('#site-nav');
  const navigationToggle = document.querySelector('#nav-toggle');

  /* Open or close the mobile menu without adding presentation-only inline CSS. */
  navigationToggle?.addEventListener('click', () => {
    const willOpen = navigationToggle.getAttribute('aria-expanded') !== 'true';

    navigationToggle.setAttribute('aria-expanded', String(willOpen));
    navigation?.classList.toggle('is-open', willOpen);
  });

  /* Close the mobile menu after a visitor selects one of its links. */
  navigation?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navigation.classList.remove('is-open');
      navigationToggle?.setAttribute('aria-expanded', 'false');
    });
  });

  /* Load shared project content only on pages containing a dynamic project area. */
  const needsProjectData = document.querySelector(
    '#featured-cards, #machining-grid, #engineering-grid'
  );

  if (needsProjectData) {
    fetch('/data/projects.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Project data request failed: ${response.status}`);
        }

        return response.json();
      })
      .then((data) => {
        renderFeatured(data);
        renderGrid(
          'machining',
          data.projects.filter((project) => project.category === 'machining')
        );
        renderGrid(
          'engineering',
          data.projects.filter((project) => project.category === 'engineering')
        );
      })
      .catch((error) => {
        console.warn('Project data could not be loaded.', error);
      });
  }

  /* Cache the optional project-details modal used by generated cards. */
  const modal = document.querySelector('#project-modal');

  /* Close the modal from its button, backdrop, or the Escape key. */
  modal?.querySelector('.modal-close')?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeModal();
  });

  /* Hide the details modal and remove content left by the previous project. */
  function closeModal() {
    if (!modal) return;

    modal.setAttribute('aria-hidden', 'true');
    modal.querySelector('#modal-body')?.replaceChildren();
  }

  /* Fill and display the details modal for one project record. */
  function openModal(project) {
    if (!modal) return;

    const modalBody = modal.querySelector('#modal-body');
    if (!modalBody) return;

    modalBody.innerHTML = `
      <h2>${escapeHtml(project.title)}</h2>
      <p class="small">Category: ${escapeHtml(project.category)}</p>
      <img
        src="${project.images?.[0] || '/assets/images/project1.svg'}"
        alt="${escapeHtml(project.title)} image"
        style="width: 100%; height: auto; border-radius: 6px; margin-bottom: 0.5rem;">
      <h3>Summary</h3>
      <p>${escapeHtml(project.summary || 'Project summary unavailable.')}</p>
      <h3>Details</h3>
      <dl>
        <dt>Material</dt><dd>${escapeHtml(project.material || '—')}</dd>
        <dt>Processes</dt><dd>${escapeHtml(project.processes || '—')}</dd>
        <dt>Equipment</dt><dd>${escapeHtml(project.equipment || '—')}</dd>
        <dt>Tolerances</dt><dd>${escapeHtml(project.tolerances || '—')}</dd>
        <dt>Role</dt><dd>${escapeHtml(project.role || '—')}</dd>
      </dl>
      <h3>Notes</h3>
      <p>${escapeHtml(project.notes || '—')}</p>
    `;

    modal.setAttribute('aria-hidden', 'false');
    modal.querySelector('.modal-close')?.focus();
  }

  /* Insert the first three project records into the home-page feature grid. */
  function renderFeatured(data) {
    const container = document.querySelector('#featured-cards');
    if (!container) return;

    data.projects.slice(0, 3).forEach((project) => {
      const media = project.video
        ? `<iframe src="${project.video}" title="${escapeHtml(project.title)} demonstration" allowfullscreen></iframe>`
        : `<img src="${project.images?.[0] || '/assets/images/project1.svg'}" alt="${escapeHtml(project.title)}">`;

      const card = document.createElement('article');
      card.className = 'card';
      card.innerHTML = `
        <div class="featured-media">${media}</div>
        <h3>${escapeHtml(project.title)}</h3>
        <p class="small">${escapeHtml(project.summary || '')}</p>
        <p><a class="btn" href="${project.detailsPage || '#'}">View Details</a></p>
      `;

      container.appendChild(card);
    });
  }

function renderGrid(type, projects) {
  const id = type === 'machining'
    ? 'machining-grid'
    : 'engineering-grid';

  const container = document.getElementById(id);

  if (!container) return;

  /*
    The machining page gets a custom chronological project layout.
    The engineering page continues using the regular project cards.
  */
  if (type === 'machining') {
    renderMachiningProjects(container, projects);
    return;
  }

  projects.forEach(project => {
    const card = document.createElement('article');
    card.className = 'card';

    card.innerHTML = `
      <img
        src="${project.images?.[0] || '/assets/images/project1.svg'}"
        alt="${escapeHtml(project.title)} image">

      <h3>${escapeHtml(project.title)}</h3>

      <p class="small">
        ${escapeHtml(project.material || '')}
      </p>

      <p>
        <button class="btn" data-id="${project.id}">
          View details
        </button>
      </p>
    `;

    container.appendChild(card);

    card.querySelector('button')?.addEventListener('click', () => {
      openModal(project);
    });
  });
}


/*
  Builds the complete machining-project layout.
*/
function renderMachiningProjects(container, projects) {
  const airMotorProject = projects.find(project => project.id === 'mach-001');

  const machiningSection = document.createElement('section');
  machiningSection.className = 'machining-projects-layout';

  machiningSection.innerHTML = `
    <article class="card machining-feature-card">

      <div class="machining-project-heading">
        <h2>Air Motor</h2>

        <p>
          A machined pneumatic motor produced from aluminum, brass,
          tool steel, and stainless steel components.
        </p>
      </div>

      <div class="air-motor-media">

        <model-viewer
          class="air-motor-model"
          src="../assets/images/Air_Motor_Content/Portfolio_Air_Motor.glb"
          alt="Interactive 3D model of the completed air motor"
          camera-controls
          auto-rotate
          shadow-intensity="1">
        </model-viewer>

        <img
          src="../assets/images/Air_Motor_Content/Air_Motor_Working.gif"
          alt="Completed air motor operating">

      </div>

      <div
        class="project-slideshow project-slideshow-small"
        data-slideshow="air-motor">

        <h3>Air Motor Manufacturing Progress</h3>

        <p class="slideshow-description">
          Progress shown in chronological order.
        </p>

        <div class="slideshow-stage">

          <figure class="slideshow-slide active">
            <img
              src="../assets/images/Air_Motor_Content/Air_Motor_parts_1.jpeg"
              alt="First group of machined air motor components">

            <figcaption>
              1. Initial machined components
            </figcaption>
          </figure>

          <figure class="slideshow-slide">
            <img
              src="../assets/images/Air_Motor_Content/Air_Motor_Parts_2.jpeg"
              alt="Additional machined air motor components">

            <figcaption>
              2. Additional completed components
            </figcaption>
          </figure>

          <figure class="slideshow-slide">
            <img
              src="../assets/images/Air_Motor_Content/Air_Motor_Fully_Assembled.jpg"
              alt="Fully assembled air motor">

            <figcaption>
              3. Fully assembled air motor
            </figcaption>
          </figure>

        </div>

        <div class="slideshow-controls">
          <button
            class="slideshow-button slideshow-previous"
            type="button"
            aria-label="Show previous Air Motor slide">
            &#10094; Previous
          </button>

          <span class="slideshow-counter" aria-live="polite">
            1 / 3
          </span>

          <button
            class="slideshow-button slideshow-next"
            type="button"
            aria-label="Show next Air Motor slide">
            Next &#10095;
          </button>
        </div>

      </div>

      ${
        airMotorProject
          ? `
            <p class="machining-details-button">
              <button class="btn air-motor-details-button" type="button">
                View Air Motor Details
              </button>
            </p>
          `
          : ''
      }

    </article>


      

    <article class="card machining-feature-card">

      <div class="machining-project-heading">
        <h2>Arts &amp; Sciences Machine Shop Sign</h2>

        <p>
          Development of the machine-shop sign from the original CAD
          concept through setup, machining, finishing, and final assembly.
        </p>
      </div>

      <div class="machining-model-slideshow-row">

  <model-viewer
    class="machining-project-model shop-sign-model"
    src="../assets/images/Shop-Sign-Content/Machine_Shop_Sign.glb"
    alt="Interactive 3D model of the Arts and Sciences Machine Shop sign"
    camera-controls
    auto-rotate
    shadow-intensity="1"
    exposure="1">
  </model-viewer>

      <div
        class="project-slideshow project-slideshow-large"
        data-slideshow="machine-shop-sign">

        <div class="slideshow-stage">

          <figure class="slideshow-slide active">
            <img
              src="../assets/images/Shop-Sign-Content/ASC_Machine_Shop_CAD_Concept.jpeg"
              alt="Original CAD concept for the Arts and Sciences Machine Shop sign">

            <figcaption>
              1. Original CAD concept
            </figcaption>
          </figure>

          <figure class="slideshow-slide">
            <img
              src="../assets/images/Shop-Sign-Content/ASC_Machine_Shop_Sign_OP1_Finished.jpeg"
              alt="Machine Shop sign after completion of operation 1">

            <figcaption>
              2. Operation 1 completed
            </figcaption>
          </figure>

          <figure class="slideshow-slide">
            <img
              src="../assets/images/Shop-Sign-Content/ASC_Machine_Shop_Sign_OP2_Set_up.jpeg"
              alt="Machine Shop sign operation 2 setup">

            <figcaption>
              3. Operation 2 setup
            </figcaption>
          </figure>

          <figure class="slideshow-slide">
            <video
              controls
              preload="metadata"
              playsinline>
              <source
                src="../assets/images/Shop-Sign-Content/ASC_Machine_Shop_Sign_OP2_Rough_Video.mp4"
                type="video/mp4">
              Your browser does not support this video.
            </video>

            <figcaption>
              4. Operation 2 rough machining
            </figcaption>
          </figure>

          <figure class="slideshow-slide">
            <img
              src="../assets/images/Shop-Sign-Content/ASC_Machine_Shop_Sign_OP2_Semi_Rough.jpeg"
              alt="Machine Shop sign after semi-rough machining">

            <figcaption>
              5. Operation 2 semi-rough condition
            </figcaption>
          </figure>

          <figure class="slideshow-slide">
            <video
              controls
              preload="metadata"
              playsinline>
              <source
                src="../assets/images/Shop-Sign-Content/ASC_Machine_Shop_Sign_OP2_Semi_Finish_Video.mp4"
                type="video/mp4">
              Your browser does not support this video.
            </video>

            <figcaption>
              6. Operation 2 semi-finish machining
            </figcaption>
          </figure>

          <figure class="slideshow-slide">
            <video
              controls
              preload="metadata"
              playsinline>
              <source
                src="../assets/images/Shop-Sign-Content/ASC_Machine_Shop_Sign_OP2_Finished_Video.mp4"
                type="video/mp4">
              Your browser does not support this video.
            </video>

            <figcaption>
              7. Final operation 2 machining
            </figcaption>
          </figure>

          <figure class="slideshow-slide">
            <img
              src="../assets/images/Shop-Sign-Content/ASC_Machine_Shop_Sign.jpg"
              alt="Completed Arts and Sciences Machine Shop sign">

            <figcaption>
              8. Completed Arts &amp; Sciences Machine Shop sign
            </figcaption>
          </figure>

        </div>

        <div class="slideshow-controls">
          <button
            class="slideshow-button slideshow-previous"
            type="button"
            aria-label="Show previous Machine Shop Sign slide">
            &#10094; Previous
          </button>

          <span class="slideshow-counter" aria-live="polite">
            1 / 8
          </span>

          <button
            class="slideshow-button slideshow-next"
            type="button"
            aria-label="Show next Machine Shop Sign slide">
            Next &#10095;
          </button>
        </div>

      </div>

    </div>

    </article>



    <article class="card machining-feature-card">

      <div class="machining-project-heading">
        <h2>Titan-76M</h2>

        <p>
          Chronological machining progress from the first operation
          through the completed component.
        </p>
      </div>

      <div class="machining-model-slideshow-row">

        <model-viewer
          class="machining-project-model"
          src="../assets/images/Titan-76M-Content/TITAN-76M.glb"
          alt="Interactive 3D model of the Titan-76M component"
          camera-controls
          auto-rotate
          shadow-intensity="1"
          exposure="1">
        </model-viewer>

      <div
        class="project-slideshow project-slideshow-large"
        data-slideshow="titan-76m">

        <div class="slideshow-stage">

          <figure class="slideshow-slide active">
            <video
              controls
              preload="metadata"
              playsinline>
              <source
                src="../assets/images/Titan-76M-Content/Titan_76M_OP1_Roughing_Video.mp4"
                type="video/mp4">
              Your browser does not support this video.
            </video>

            <figcaption>
              1. Operation 1 rough machining
            </figcaption>
          </figure>

          <figure class="slideshow-slide">
            <img
              src="../assets/images/Titan-76M-Content/Titan_76M_OP1_Finished.jpeg"
              alt="Titan-76M after completion of operation 1">

            <figcaption>
              2. Operation 1 completed
            </figcaption>
          </figure>


          <figure class="slideshow-slide">
            <video
              controls
              preload="metadata"
              playsinline>
              <source
                src="../assets/images/Titan-76M-Content/Titan_76M_OP2_Roughing_Video.mp4"
                type="video/mp4">
              Your browser does not support this video.
            </video>

            <figcaption>
              3. Operation 2 rough machining
            </figcaption>
          </figure>


          <figure class="slideshow-slide">
            <img
              src="../assets/images/Titan-76M-Content/Titan_76M_OP2_Roughed.jpeg"
              alt="Titan-76M during operation 2 rough machining">

            <figcaption>
              4. Operation 2 rough-machined condition
            </figcaption>
          </figure>

          <figure class="slideshow-slide">
            <img
              src="../assets/images/Titan-76M-Content/Titan_76M_OP2_Finished.jpeg"
              alt="Titan-76M after completion of operation 2">

            <figcaption>
              5. Operation 2 completed
            </figcaption>
          </figure>

          <figure class="slideshow-slide">
            <img
              src="../assets/images/Titan-76M-Content/Titan_76M_Finished.jpeg"
              alt="Completed Titan-76M component">

            <figcaption>
              6. Finished Titan-76M component
            </figcaption>
          </figure>

        </div>

        <div class="slideshow-controls">
          <button
            class="slideshow-button slideshow-previous"
            type="button"
            aria-label="Show previous Titan-76M slide">
            &#10094; Previous
          </button>

          <span class="slideshow-counter" aria-live="polite">
            1 / 6
          </span>

          <button
            class="slideshow-button slideshow-next"
            type="button"
            aria-label="Show next Titan-76M slide">
            Next &#10095;
          </button>
        </div>

      </div>

    </div>

    </article>

  `;

  container.appendChild(machiningSection);

  if (airMotorProject) {
    machiningSection
      .querySelector('.air-motor-details-button')
      ?.addEventListener('click', () => {
        openModal(airMotorProject);
      });
  }

  initializeSlideshows(machiningSection);
}


/*
  Activates every slideshow inside the supplied section.
*/
function initializeSlideshows(section) {
  const slideshows = section.querySelectorAll('.project-slideshow');

  slideshows.forEach(slideshow => {
    const slides = Array.from(
      slideshow.querySelectorAll('.slideshow-slide')
    );

    const previousButton = slideshow.querySelector(
      '.slideshow-previous'
    );

    const nextButton = slideshow.querySelector(
      '.slideshow-next'
    );

    const counter = slideshow.querySelector(
      '.slideshow-counter'
    );

    let currentSlide = 0;

    function showSlide(newIndex) {
      /*
        Wrap around when the viewer reaches either end.
      */
      if (newIndex < 0) {
        currentSlide = slides.length - 1;
      } else if (newIndex >= slides.length) {
        currentSlide = 0;
      } else {
        currentSlide = newIndex;
      }

      slides.forEach((slide, index) => {
        const isActive = index === currentSlide;

        slide.classList.toggle('active', isActive);
        slide.setAttribute(
          'aria-hidden',
          isActive ? 'false' : 'true'
        );

        /*
          Stop videos when the user leaves a slide.
        */
        if (!isActive) {
          slide.querySelectorAll('video').forEach(video => {
            video.pause();
          });
        }
      });

      counter.textContent =
        `${currentSlide + 1} / ${slides.length}`;
    }

    previousButton.addEventListener('click', () => {
      showSlide(currentSlide - 1);
    });

    nextButton.addEventListener('click', () => {
      showSlide(currentSlide + 1);
    });

    showSlide(0);
  });
}

  /* Escape project data before inserting it into generated HTML. */
  function escapeHtml(value) {
    if (value === undefined || value === null) return '';

    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }
});
