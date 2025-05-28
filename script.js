const logo = document.querySelector('.logo');
const letters = document.querySelectorAll('.hover-k, .hover-m');
let hoverCount = 0;

logo.addEventListener('mouseenter', () => {
  hoverCount++;

  const isOdd = hoverCount % 2 === 1;

  const mTransform = isOdd ? 'translateX(-20px)' : 'translateX(20px)';
  const kTransform = isOdd ? 'translateX(20px)' : 'translateX(-20px)';

  letters.forEach(el => el.classList.add('moving'));

  letters.forEach(el => {
    if (el.classList.contains('hover-m')) {
      el.style.transform = mTransform;
    } else {
      el.style.transform = kTransform;
    }
  });

  setTimeout(() => {
    letters.forEach(el => {
      el.style.transform = 'translateX(0px)';
    });
  }, 300);

  // 이동 중에는 다시 트리거되지 않도록 잠깐 막기
  setTimeout(() => {
    letters.forEach(el => el.classList.remove('moving'));
  }, 600);
});