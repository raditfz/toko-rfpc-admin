import React, { useState, useEffect } from "react";
import { db, collection, getDocs } from "./firebase";
import BuyModule from "./BuyModule";

const AKAkunMobile = () => {
  const [showModal, setShowModal] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [expandedCard, setExpandedCard] = useState(null);
  const akAccountRef = collection(db, "AKAccount");

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    filterAndSortAccounts();
  }, [searchTerm, sortOrder, accounts]);

  const fetchAccounts = async () => {
    const snapshot = await getDocs(akAccountRef);
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setAccounts(data);
  };

  const filterAndSortAccounts = () => {
    let filtered = accounts.filter((acc) =>
      acc.operator.some((op) =>
        op.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    if (sortOrder === "asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else {
      filtered.sort((a, b) => b.price - a.price);
    }

    setFilteredAccounts(filtered);
  };

  const toggleCard = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  const handleBuyClick = (account) => {
    setSelectedAccount(account);
    setShowModal(true);
  }; 

  return (
    <div className="container mt-6" style={{ maxWidth: "90%", marginTop: "80px", marginBottom: "60px" }}>
      <BuyModule show={showModal} handleClose={() => setShowModal(false)} selectedAccount={selectedAccount} />
      {/* Input Pencarian & Sortir */}
      <div className="d-flex justify-content-between mb-3">
        <input
          type="text"
          className="form-control w-75"
          placeholder="Cari Operator..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="form-select w-25"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="asc">Harga Terendah</option>
          <option value="desc">Harga Tertinggi</option>
        </select>
      </div>

      {/* Daftar Akun */}
      <div className="d-flex flex-column">
        {filteredAccounts.map((acc) => (
          <div key={acc.id} className="card mb-3 w-100 border-dark border-1">
            <div className="card-body p-3">
              {/* Operator & Info Utama */}
              <h5 className="card-title fw-bold">
                {truncateText(acc.operator.join(", "), 50)}
              </h5>
              <p className="text-muted small" style={{marginBottom:"0"}}>{acc.id}</p>
              <p className="card-text">
                <strong>Level:</strong> {acc.level} | <strong>Story:</strong> {acc.story} <br />
                <strong>Orundum:</strong> {acc.orundum} | <strong>Originite:</strong> {acc.originite}
              </p>

              {/* Tombol Beli & Harga */}
              <button className="btn btn-warning w-100" onClick={() => handleBuyClick(acc)}> Beli! </button>
              <p className="text-dark mt-1 mb-0 text-center fw-bold">
                Rp.{acc.price}
              </p>
            </div>

            {/* Bagian Dropdown Detail */}
            {expandedCard === acc.id && (
              <div className="card-footer">
                <div className="block justify-content-center">
                  {acc.image1 && (
                    <iframe
                      src={acc.image1}
                      width="100%"
                      height="130"
                      seamless
                    ></iframe>
                  )}
                  {acc.image2 && (
                    <iframe
                      src={acc.image2}
                      width="100%"
                      height="130"
                      seamless
                    ></iframe>
                  )}
                </div>
                <p className="mt-2">
                  <strong>Detail:</strong> {acc.detail}
                </p>
              </div>
            )}

            {/* Tombol Lihat Detail */}
            <button
              className="btn btn-light w-100"
              onClick={() => toggleCard(acc.id)}
            >
              {expandedCard === acc.id ? "Tutup detail" : "Lihat lebih.."}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AKAkunMobile;
