//Making and "Opening" the cache

let global_url = '/facemasks';
let global_cacheName = 'Facemasks';
let availabUrl = '/availability/';

// *  Checking whether the cache is already an existing one

checkCache(global_cacheName, global_url);

function checkCache(cacheName, url) {
  caches
    .has(cacheName)
    .then((hasCache) => {
      if (!hasCache) {
        openCache(cacheName, url);
      } else {
        expirCache(cacheName, url);
      }
    })
    .catch((error) => {
      caches.delete(cacheName);
      openCache(cacheName, url);
      console.error(error);
    });
}

// * Opening the cache

async function openCache(cacheName, url) {
  const cache = await caches.open(cacheName);
  const response = await cache.add(url);
  if (response == '[]') {
    checkCache(cacheName, url);
  } else if (!response) {
    console.log('Data cached');
    getCache(cacheName, url);
  }
}

// * Making an "expiration" type mechanism

async function expirCache(cacheName, url) {
  const cache = await caches.open(cacheName);
  const response = await cache.match(url);

  if (response === undefined) {
    caches.delete(cacheName);
    openCache(cacheName, url);
  }

  const date = new Date(response.headers.get('date'));

  if (Date.now() > date.getTime() + 1000 * 60 * 5) {
    await caches.delete(cacheName);
    await openCache(cacheName, url);
  } else {
    console.log('Data already cached');
    getCache(cacheName, url);
  }
}

var Availability;

//  * Retrieving and showing the data form the cache

async function getCache(cacheName, url) {
  const cache = await caches.open(cacheName);
  const response = await cache.match(url);
  const data = await response.text();
  var res = JSON.parse(data);
  var manufacturerArr = res.map(({ manufacturer }) => manufacturer);
  var manufacturers = [...new Set(manufacturerArr)];
  console.log(manufacturers);

  var Manufacturer;
  res.forEach((product) => {
    // Getting the ID
    var ID = product.id;

    // Gettign the TYPE
    var type = product.type;

    // Getting the NAME
    var name = product.name;

    // Combining COLOR/S (if >1) adn getting them
    var color = product.color;

    // Getting the PRICE
    var price = product.price;

    // Getting the manufacturer

    var manufacturer = product.manufacturer;
    Manufacturer = manufacturer;
    //Showing the result/s
    var ul = document.querySelector('.products ul');
    var li = document.createElement('li');
    var spanID = document.createElement('span');
    var spanName = document.createElement('span');
    var spanColor = document.createElement('span');
    var spanType = document.createElement('span');
    var spanPrice = document.createElement('span');
    var spanManufacturer = document.createElement('span');
    var div = document.createElement('div');
    var textNode_ID = document.createTextNode('id: ' + ID);
    var textNode_type = document.createTextNode('Type: ' + type);
    var textNode_Name = document.createTextNode(name);
    var textNode_manufacturer = document.createTextNode(
      'Manufacturer: ' + manufacturer
    );
    var textNode_Color = document.createTextNode('Color: ' + color);
    var textNode_Price = document.createTextNode('Price: ' + price + ',-');

    spanID.className = 'ID';
    spanName.className = 'Name';
    spanColor.className = 'Color';
    spanType.className = 'Type';
    spanPrice.className = 'Price';
    spanManufacturer.className = 'Manufacturer';
    div.className = 'avail';

    var bID = 'b' + ID;
    div.classList.add(bID);

    // * Making the list

    spanID.appendChild(textNode_ID);
    spanName.appendChild(textNode_Name);
    spanColor.appendChild(textNode_Color);
    spanType.appendChild(textNode_type);
    spanPrice.appendChild(textNode_Price);
    spanManufacturer.appendChild(textNode_manufacturer);
    li.appendChild(spanID);
    li.appendChild(spanName);
    li.appendChild(spanColor);
    li.appendChild(spanType);
    li.appendChild(spanPrice);
    li.appendChild(spanManufacturer);
    li.appendChild(div);
    ul.appendChild(li);

    id = ID;

    checkAvailability(Manufacturer, id);
  });
}

async function checkAvailability(manufacturer, id) {
  caches
    .has(manufacturer)
    .then((hasCache) => {
      if (!hasCache) {
        openAvailability(manufacturer, id);
      } else {
        expirAvailability(manufacturer, id);
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

async function expirAvailability(manufacturer, id) {
  const cache = await caches.open(manufacturer);
  const response = await cache.match(availabUrl + manufacturer);

  if ((response.value = undefined)) {
    caches.delete(manufacturer);
    openAvailability(manufacturer, id);
  }

  var date = new Date(response.headers.get('date'));

  if (Date.now() > date.getTime + 1000 * 60 * 5) {
    await caches.delete(manufacturer);
    openAvailability(manufacturer, id);
  } else {
    getAvailability(manufacturer, id);
  }
}

async function openAvailability(manufacturer, id) {
  const cache = await caches.open(manufacturer);
  const response = await cache.add(availabUrl + manufacturer);

  if (!response) {
    getAvailability(manufacturer, id);
  } else if ((response = '[]')) {
    caches.delete(availabUrl + manufacturer);
    openAvailability(manufacturer, id);
  } else {
    getAvailability(manufacturer, id);
  }
}

async function getAvailability(manufacturer, id) {
  const cache = await caches.open(manufacturer);
  const response = await cache.match(availabUrl + manufacturer);
  const data = await response.text();
  var res = JSON.parse(data);
  var ID = id.toUpperCase();
  var Response = res.response;
  var finalResult;
  var availability;

  var bID = 'b' + id;
  var div = document.querySelector(`.${bID}`);

  for (i = 0; i <= Response.length - 1; i++) {
    if (Response[i].id == ID) {
      var finalResult = Response[i];
      availability = finalResult.DATAPAYLOAD;
      console.log(availability);
      finalResult = 0;
    }
  }

  if (availability.includes('OUTOFSTOCK')) {
    div.classList.toggle('_outOfStock');
  } else if (availability.includes('LESSTHAN10')) {
    div.classList.toggle('_lessThanTen');
  } else {
    div.classList.toggle('_inStock');
  }
}
