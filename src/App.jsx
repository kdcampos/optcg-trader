import { useState, useEffect } from "react";
import cart from "./assets/cart.png";
import trash from "./assets/trash.png";
import logo from "./assets/logo.png";
import "./App.css";

function App() {
  const BASE_URL = "https://tcgcsv.com/tcgplayer";

  const CATEGORY_ID = 68; // One Piece is 68

  const [products, setProducts] = useState(0);

  const [items, setItems] = useState([]);

  const [showCart, setShowCart] = useState(false);

  const [selectedSet, setSelectedSet] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const sets = [
    { label: "OP-01", id: 3188 },
    { label: "OP-02", id: 17698 },
    { label: "OP-03", id: 22890 },
    { label: "OP-04", id: 23024 },
    { label: "OP-05", id: 23213 },
    { label: "OP-06", id: 23272 },
    { label: "OP-07", id: 23387 },
    { label: "OP-08", id: 23462 },
    { label: "OP-09", id: 23589 },
    { label: "OP-10", id: 23766 },
    { label: "OP-11", id: 24241 },
    { label: "EB-01", id: 23333 },
    { label: "EB-02", id: 23834 },
    { label: "PRB-01", id: 23496 },
  ];

  const decks = [
    { label: "ST-01", id: 3189 },
    { label: "ST-02", id: 3191 },
    { label: "ST-03", id: 3192 },
    { label: "ST-04", id: 3190 },
    { label: "ST-05", id: 17687 },
    { label: "ST-06", id: 17699 },
    { label: "ST-07", id: 22930 },
    { label: "ST-08", id: 22956 },
    { label: "ST-09", id: 22957 },
    { label: "ST-10", id: 23243 },
    { label: "ST-11", id: 23250 },
    { label: "ST-12", id: 23348 },
    { label: "ST-13", id: 23349 },
    { label: "ST-14", id: 23489 },
    { label: "ST-15", id: 23490 },
    { label: "ST-16", id: 23491 },
    { label: "ST-17", id: 23492 },
    { label: "ST-18", id: 23493 },
    { label: "ST-19", id: 23494 },
    { label: "ST-20", id: 23495 },
    { label: "ST-21", id: 23991 },
    { label: "ST-22", id: 24304 },
    { label: "ST-23", id: 24282 },
    { label: "ST-24", id: 24283 },
    { label: "ST-25", id: 24284 },
    { label: "ST-26", id: 24285 },
    { label: "ST-27", id: 24286 },
    { label: "ST-28", id: 24287 },
  ];

  async function fetchProducts(categoryId, groupId) {
    const productsResponse = await fetch(
      `${BASE_URL}/${categoryId}/${groupId}/products`
    );
    return await productsResponse.json();
  }

  async function fetchPrices(categoryId, groupId) {
    const pricesResponse = await fetch(
      `${BASE_URL}/${categoryId}/${groupId}/prices`
    );
    return await pricesResponse.json();
  }

  async function main(groupId) {
    const fetchedProducts = (await fetchProducts(CATEGORY_ID, groupId)).results;
    const fetchedPrices = (await fetchPrices(CATEGORY_ID, groupId)).results;

    const joinedProducts = fetchedProducts
      .map((product) => ({
        ...product,
        prices: fetchedPrices.filter(
          (price) => product.productId == price.productId
        ),
      }))
      .filter((product) => product.prices.length > 0);

    console.log(joinedProducts);
    setProducts(joinedProducts);
  }

  function handleCart(item) {
    setItems((prevItems) => [...prevItems, item]);
  }

  const handleChange = (e) => {
    const id = parseInt(e.target.value);
    setSelectedSet(id); // still update state if needed elsewhere
    main(id); // pass it directly
  };

  const removeItem = (indexToRemove) => {
    setItems((prevItems) =>
      prevItems.filter((_, index) => index !== indexToRemove)
    );
  };

  return (
    <>
      {/* header */}
      <header>
        <img className="logo" src={logo} alt="logo" />
        <button
          className={`toggle-cart-button ${showCart ? "hidden" : ""}`}
          onClick={() => setShowCart(true)}
        >
          <img src={cart} alt="cart" />
          {items.length > 0 && (
            <span className="item-count">{items.length}</span>
          )}
        </button>
      </header>

      {/* dropdown menus for sets*/}
      <div className="dropdowns">
        <div>
          <select
            value={selectedSet}
            onChange={handleChange}
            className="setDropdown"
          >
            <option value="">Mainline sets</option>
            {sets.map((set) => (
              <option key={set.id} value={set.id}>
                {set.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={selectedSet}
            onChange={handleChange}
            className="setDropdown"
          >
            <option value="">Starter decks</option>
            {decks.map((deck) => (
              <option key={deck.id} value={deck.id}>
                {deck.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/*main section after set is selected */}
      <div className="trader">
        <input
          type="text"
          placeholder="Search cards..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`searchBar ${selectedSet ? "visible" : "hidden"}`}
        />

        {/* cards go here */}
        <div className="cardList">
          <div className="cards">
            {Object.keys(products)
              .filter((productKey) => {
                const product = products[productKey];
                const name = product.cleanName.toLowerCase();
                return name.includes(searchTerm.toLowerCase());
              })
              .map((productKey) => {
                const product = products[productKey];
                const cleanName = product.cleanName;
                const lowPrice = product.prices[0].lowPrice;

                return (
                  <div key={productKey}>
                    <button
                      className="card"
                      onClick={() => handleCart({ cleanName, lowPrice })}
                    >
                      <img src={product.imageUrl} alt="" />
                    </button>
                    <p className="prices">${lowPrice}</p>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* cart */}
      <div className={`cart-slide ${showCart ? "open" : ""}`}>
        <div>
          <button className="closeCart" onClick={() => setShowCart(false)}>
            X
          </button>
        </div>

        <div className="cart-header">
          <h2>Cards</h2>
        </div>

        <div className="cart-items">
          {items.map((item, index) => {
            const isEven = index % 2 === 0;
            const itemClass = isEven ? "cart-item even" : "cart-item odd";

            return (
              <div key={index} className={itemClass}>
                <div className="item">
                  <p>{item.cleanName}</p>
                  <p className="prices">${item.lowPrice}</p>
                </div>
                <div className="remove">
                  <button
                    className="remove-button"
                    onClick={() => removeItem(index)}
                  >
                    <img src={trash} alt="trash" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="total">
          <p>
            <strong>Total: </strong>$
            {items.reduce((sum, item) => sum + item.lowPrice, 0).toFixed(2)}
          </p>
        </div>

        <button className="clearCart" onClick={() => setItems([])}>
          Clear Cart
        </button>
      </div>
    </>
  );
}

export default App;
