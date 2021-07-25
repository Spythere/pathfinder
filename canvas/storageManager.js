function StorageManager(key = null) {
  this.key = key;
}

StorageManager.prototype.setKey = function (key) {
  this.key = key;
};

// StorageManager.prototype.setItem = function (item) {
//   window.localStorage.setItem(this.key, item);
// };

// StorageManager.prototype.getItem = function () {
//   window.localStorage.getItem(this.key);
// };

// StorageManager.prototype.removeItem = function () {
//   window.localStorage.removeItem(this.key);
// };

StorageManager.prototype.saveGridState = function () {
  console.log(grid);
  const gridStr = JSON.stringify(grid);

  window.localStorage.setItem(this.key, gridStr);
};

StorageManager.prototype.retrieveState = function () {
  const savedState = window.localStorage.getItem(this.key);

  if (!savedState) return;

  const retrievedGrid = JSON.parse(savedState);

  grid = { ...retrievedGrid };
};
