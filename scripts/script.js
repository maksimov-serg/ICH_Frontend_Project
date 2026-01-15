const ROUTES = {
  home: "/index.html",
  events: "/events_location.html",
};

const EVENTS = [
  {
    id: 1,
    title: "All Nations - Manhattan Missions Church Bible Study",
    date: "2024-03-13T23:30:00Z",
    type: "offline",
    category: "Hobbies and Passions",
    distanceKm: 5,
    image: "/assets/images/event_webp.png",
    attendees: null,
    spotsLeft: null,
  },
  {
    id: 2,
    title: "INFJ Personality Type - Coffee Shop Meet & Greet",
    date: "2024-03-23T15:00:00Z",
    type: "offline",
    category: "Hobbies and Passions",
    distanceKm: 25,
    image: "/assets/images/event_2.webp.png",
    attendees: 99,
    spotsLeft: null,
  },
  {
    id: 3,
    title:
      "NYC AI Users - AI Tech Talks, Demo & Social: RAG Search and Customer Experience",
    date: "2024-03-13T23:30:00Z",
    type: "offline",
    category: "Technology",
    distanceKm: 50,
    image: "/assets/images/event_3.webp.png",
    attendees: 43,
    spotsLeft: 2,
  },
  {
    id: 4,
    title: "Book 40+ Appointments Per Month Using AI and Automation",
    date: "2024-03-13T23:30:00Z",
    type: "online",
    category: "Technology",
    distanceKm: 0,
    image: "/assets/images/event_4.png",
    attendees: null,
    spotsLeft: null,
  },
  {
    id: 5,
    title: "Dump writing group weekly meetup",
    date: "2024-03-13T23:00:00Z",
    type: "online",
    category: "Hobbies and Passions",
    distanceKm: 0,
    image: "/assets/images/event_5.webp.png",
    attendees: 77,
    spotsLeft: null,
  },
  {
    id: 6,
    title: "Over 40s, 50s, & 60s Senior Singles Chat, Meet & Dating Community",
    date: "2024-03-14T23:00:00Z",
    type: "online",
    category: "Hobbies and Passions",
    distanceKm: 0,
    image: "/assets/images/event_6.webp.png",
    attendees: 140,
    spotsLeft: null,
  },
];

function formatEventDate(isoString) {
  const d = new Date(isoString);
  const weekday = d.toLocaleString("en-US", {
    weekday: "short",
    timeZone: "UTC",
  });
  const month = d.toLocaleString("en-US", { month: "short", timeZone: "UTC" });
  const day = d.toLocaleString("en-US", { day: "2-digit", timeZone: "UTC" });

  const time = d.toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  });

  return `${weekday}, ${month} ${day} · ${time} UTC`;
}

function normalizeDay(isoString) {
  const d = new Date(isoString);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function initNavigation() {
  const joinBtn = document.querySelector("#joinMeetupBtn");
  if (joinBtn) {
    joinBtn.addEventListener("click", () => {
      window.location.href = ROUTES.events;
    });
  }

  const logoImg = document.querySelector(".logo");
  if (logoImg && !logoImg.closest("a")) {
    logoImg.style.cursor = "pointer";
    logoImg.addEventListener("click", () => {
      window.location.href = ROUTES.home;
    });
  }
}

// --- EVENTS PAGE (render + filters) ---
function initHomePage() {
  const grid = document.querySelector("#homeEventsGrid");
  const onlineGrid = document.querySelector("#homeOnlineEventsGrid");
  if (!grid && !onlineGrid) return;

  function renderHomeCard(e) {
    return `
      <div class="cardEvent">
        <div class="eventsCardTop">
          <img src="${e.image}" alt="Events image" />
        </div>
        <div class="eventsCardBottom">
          <h4>${e.title}</h4>
          <p class="typeEvent">${e.category}${
      e.type === "offline" ? ` (${e.distanceKm} km)` : ""
    }</p>
          <p class="dataEvent">
            <img src="/assets/icons/Data.svg" alt="" />
            ${formatEventDate(e.date)}
          </p>
          <div class="cardInfo">
            <p class="quantity">
              <img src="/assets/icons/Quantity.svg" alt="" />
              ${typeof e.attendees === "number" ? `${e.attendees} going` : "—"}
            </p>
            <p class="status">
              <img src="/assets/icons/Status.svg" alt="" />
              Free
            </p>
          </div>
        </div>
      </div>
    `;
  }

  if (grid) {
    const homeOffline = EVENTS.filter((e) => e.type === "offline").slice(0, 8);
    grid.innerHTML = homeOffline.map(renderHomeCard).join("");
  }

  if (onlineGrid) {
    const homeOnline = EVENTS.filter((e) => e.type === "online").slice(0, 4);
    onlineGrid.innerHTML = homeOnline.map(renderHomeCard).join("");
  }
}

function initEventsPage() {
  const listEl = document.querySelector("#eventsList");
  if (!listEl) return;

  const emptyEl = document.querySelector("#eventsEmpty");

  const filterDate = document.querySelector("#filterDate");
  const filterType = document.querySelector("#filterType");
  const filterDistance = document.querySelector("#filterDistance");
  const filterCategory = document.querySelector("#filterCategory");
  const resetBtn = document.querySelector("#filtersReset");

  const categories = Array.from(new Set(EVENTS.map((e) => e.category))).sort();
  for (const c of categories) {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    filterCategory.appendChild(opt);
  }

  function render(events) {
    listEl.innerHTML = "";

    if (!events.length) {
      if (emptyEl) emptyEl.style.display = "block";
      return;
    }
    if (emptyEl) emptyEl.style.display = "none";

    for (const e of events) {
      const item = document.createElement("div");
      item.className = "event";

      const distanceLabel =
        e.type === "online" ? "Online" : `${e.category} (${e.distanceKm} km)`;

      const metaParts = [];
      if (typeof e.attendees === "number")
        metaParts.push(`${e.attendees} attendees`);
      if (typeof e.spotsLeft === "number")
        metaParts.push(`${e.spotsLeft} spots left`);

      item.innerHTML = `
        <div class="eventImage">
          <img src="${e.image}" alt="" />
        </div>
        <div class="eventText">
          <p class="eventData">${formatEventDate(e.date)}</p>
          <p class="eventTitle">${e.title}</p>
          <p class="eventLocation">${distanceLabel}</p>
          ${
            metaParts.length
              ? `<div class="eventMeta">
                  <span class="attendees">${metaParts[0] ?? ""}</span>
                  ${
                    metaParts[1]
                      ? `<span class="spots">${metaParts[1]}</span>`
                      : ""
                  }
                </div>`
              : ""
          }
        </div>
      `;

      listEl.appendChild(item);
    }
  }

  function applyFilters() {
    const selectedDate = filterDate?.value || ""; // YYYY-MM-DD
    const selectedType = filterType?.value || "any";
    const selectedDistance = filterDistance?.value || "any";
    const selectedCategory = filterCategory?.value || "any";

    const maxDistance =
      selectedDistance === "any" ? null : Number(selectedDistance);

    const filtered = EVENTS.filter((e) => {
      if (selectedDate) {
        if (normalizeDay(e.date) !== selectedDate) return false;
      }

      if (selectedType !== "any" && e.type !== selectedType) return false;

      if (selectedCategory !== "any" && e.category !== selectedCategory)
        return false;

      if (maxDistance !== null && e.type === "offline") {
        if (e.distanceKm > maxDistance) return false;
      }

      return true;
    });

    render(filtered);
  }

  [filterDate, filterType, filterDistance, filterCategory].forEach((ctrl) => {
    if (!ctrl) return;
    ctrl.addEventListener("change", applyFilters);
  });

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      filterDate.value = "";
      filterType.value = "any";
      filterDistance.value = "any";
      filterCategory.value = "any";
      applyFilters();
    });
  }

  render(EVENTS);

  const mapClose = document.querySelector(".mapClose");
  const mapCard = document.querySelector(".mapCard");
  if (mapClose && mapCard) {
    mapClose.addEventListener("click", () => {
      mapCard.style.display = "none";
    });
  }
}

initNavigation();
initHomePage();
initEventsPage();
