(({ datesDiv, addDateInput, addSubmitButton }) => {
  const toIso = (x) => {
    try {
      return new Date(x).toISOString();
    } catch {
      return null;
    }
  };

  const toDay = (x) => {
    if (toIso(x) === null) return x;
    const d = new Date(x);
    const [day, time] = d.toJSON().split("T");
    const hms = `${d.getUTCHours()}:${d.getUTCMinutes()}:${d.getUTCSeconds()}`;
    if (hms === "0:0:0") return day;
    const [roundedHms] = time.split(".");
    const [h, m] = roundedHms.split(":");
    return `${day}&nbsp;${h}:${m}`;
  };

  const diff = (now) => (x) => new Date(x) - now;
  const countDays = (ms) => Math.round(ms / 1000 / 60 / 60 / 24);
  const countHours = (ms) => Math.round(ms / 1000 / 60 / 60);
  const countMinutes = (ms) => Math.round(ms / 1000 / 60);
  const countSeconds = (ms) => Math.round(ms / 1000);
  const abs = (x) =>
    typeof x === "number" ? Math.abs(x).toLocaleString() : null;

  const addUnits = (article, singular, plural, x) => {
    if (x > 1) return `in&nbsp;${abs(x)}&nbsp;${plural}`;
    if (x === 1) return `in&nbsp;${article}&nbsp;${singular}`;
    if (x === 0) return `this&nbsp;${singular}`;
    if (x === -1) return `${article}&nbsp;${singular}&nbsp;ago`;
    return `${abs(x)}&nbsp;${plural}&nbsp;ago`;
  };

  const format = ({ time, iso, day, s, m, h, d }) => {
    if (iso === null) return { time, day, f: `invalid&nbsp;date` };
    if (s < 60 && s > -60)
      return { time, day, f: addUnits("a", "second", "seconds", s) };
    if (m < 60 && m > -60)
      return { time, day, f: addUnits("a", "minute", "minutes", m) };
    if (h < 24 && h > -24)
      return { time, day, f: addUnits("an", "hour", "hours", h) };
    return { time, day, f: addUnits("a", "day", "days", d) };
  };

  const wrapInSpan = ({ time, day, f }) =>
    `<span class="remove" onclick="remove('${time}')">x</span>${day} <span class="duration">${f}</span>`;

  const update = (fn, p, n) => (x) => ({ ...x, [n]: fn(x[p]) });

  const compute = (now, dates) =>
    dates
      .map((x) => ({ time: x }))
      .map(update(toIso, "time", "iso"))
      .map(update(toDay, "time", "day"))
      .map(update(diff(now), "iso", "ms"))
      .map(update(countDays, "ms", "d"))
      .map(update(countHours, "ms", "h"))
      .map(update(countMinutes, "ms", "m"))
      .map(update(countSeconds, "ms", "s"))
      .map(format)
      .map(wrapInSpan)
      .join("<br>\n");

  const getUrlParams = () => new URLSearchParams(location.search);
  const getDates = () => getUrlParams().getAll("d");

  const render = () =>
    (datesDiv.innerHTML = `<p>${compute(new Date(), getDates())}`);

  // render and update

  render();
  setInterval(render, 1000);

  const computeDate = (d) => {
    const [day, time] = new Date(d).toJSON().split("T");
    const [roundedTime] = time.split(".");
    return `${day}T${roundedTime}Z`;
  };

  // add date input
  let addDateValue;

  const changeDate = ({ target: { value } }) => (addDateValue = value);
  const addDateAndTime = () => addDate(addDateValue || computeDate(new Date()));

  const addDate = (value) => {
    const d = new Date(value).toString();
    if (d === "Invalid Date") {
      console.log("failed to add date");
      return;
    }
    const newUrlParams = getUrlParams();
    newUrlParams.append("d", value);
    history.pushState(
      `add ${value}`,
      "",
      location.pathname + "?" + newUrlParams
    );
  };

  addDateInput.addEventListener("change", changeDate);
  addSubmitButton.addEventListener("click", addDateAndTime);
})({
  datesDiv: document.querySelector("#dates"),
  addDateInput: document.querySelector("#addDateInput"),
  addSubmitButton: document.querySelector("#addSubmitButton"),
});

document.remove = (value) => {
  const url = new URLSearchParams(location.search)
    .getAll("d")
    .filter((x) => x !== value)
    .map((x) => `d=${x}`)
    .join("&");
  history.pushState(`remove ${value}`, "", location.pathname + "?" + url);
};
