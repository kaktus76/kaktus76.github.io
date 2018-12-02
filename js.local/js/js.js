var para = document.querySelector('p');

function random(num) {
  return Math.ceil(Math.random() * num);
}

para.textContent = random(1200);;