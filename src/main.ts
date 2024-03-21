import './style.scss';

let prevIdx = 0;

const track = document.getElementById('image-track') as HTMLElement;
const images = track.getElementsByClassName('image');
const precentageDelta = 100 / images.length;

const getIdxInPrecentage = (p: number) => {
  if (p === 0) return 0;
  return Math.ceil(p / precentageDelta) - 1;
};

window.onmousedown = (e: MouseEvent) => {
  track.dataset.mouseDownAt = e.clientX.toString();
};

window.onmouseup = () => {
  track.dataset.mouseDownAt = '0';
  track.dataset.prevPrecentage = track.dataset.precentage;
};

window.onmousemove = (e: MouseEvent) => {
  if (track.dataset.mouseDownAt === '0') return;

  const mouseDelta =
      parseFloat(track.dataset.mouseDownAt as string) - e.clientX,
    maxDelta = window.innerWidth / 2;

  const precentage = (mouseDelta / maxDelta) * -100;
  let nextPrecentage =
    parseFloat(track.dataset.prevPrecentage as string) + precentage;

  nextPrecentage = Math.max(nextPrecentage, -100);
  nextPrecentage = Math.min(nextPrecentage, 0);

  track.dataset.precentage = nextPrecentage.toString();

  track.animate(
    { transform: `translate(${nextPrecentage}%, -50%)` },
    { duration: 1000, fill: 'forwards' }
  );

  const imgIdx = getIdxInPrecentage(-nextPrecentage);
  if (prevIdx !== imgIdx) {
    images[prevIdx].animate(
      {
        width: '30vmin',
        height: '56vmin',
      },
      { duration: 1000, fill: 'forwards' }
    );
    prevIdx = imgIdx;
  }

  const deltaP =
    (-nextPrecentage === -0 ? 0 : -nextPrecentage - imgIdx * precentageDelta) /
    precentageDelta;

  images[imgIdx].animate(
    {
      width: `${30 + (deltaP <= 0.5 ? 100 * deltaP : 100 * (1 - deltaP))}vmin`,
      height: `${56 + (deltaP <= 0.5 ? 80 * deltaP : 80 * (1 - deltaP))}vmin`,
    },
    { duration: 600, fill: 'forwards' }
  );

  for (const image of images) {
    image.animate(
      {
        objectPosition: `${nextPrecentage + 100}% center`,
      },
      { duration: 1000, fill: 'forwards' }
    );
  }
};
