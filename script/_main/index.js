const IndexedArray = new Proxy(Array, {
   construct: (target, [arguments]) => {
      const index = {};
      arguments.forEach(element => index[element.id] = element);

      return new Proxy(new target(...arguments), {
         get: (target, property) => {
            switch (property) {
               case 'push':
                  return element => {
                     index[element.id] = element;
                     target[property].call(target, element);
                  }
               case 'pop':
                  return () => {
                     delete target[target.length - 1];
                     delete index[target.length - 1];
                     return target;
                  }
               case 'findById':
                  return id => index[id];
               default:
                  return target[property];
            }
         }
      });
   }
});

fetch('https://jsonplaceholder.typicode.com/users')
   .then(response => response.json())
   .then(response => {
      const usersArray = new IndexedArray(response);
   })
   .catch(reject => console.log(reject));