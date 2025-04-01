import React, { useState, useEffect } from "react";
import { db, collection, getDocs} from "./firebase";
import BuyModule from "./BuyModule";

const AKAkunDesk = () => {

  const [showModal, setShowModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [accounts, setAccounts] = useState([]);
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

  const handleBuyClick = (account) => {
    setSelectedAccount(account);
    setShowModal(true);
  };  

  return (
    <div className="container mt-6" style={{ maxWidth: "60%", marginTop: "100px", marginBottom: "60px" }}>
      <BuyModule show={showModal} handleClose={() => setShowModal(false)} selectedAccount={selectedAccount} />

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

      <div className="d-flex flex-column">
  {filteredAccounts.map((acc) => (
    <div key={acc.id} className="card mb-3 w-100 border-dark border-1">
      <div className="row g-0 align-items-center">
        {/* Kolom 1 - Info Operator & Dokumen ID */}
        <div className="col-9 p-3">
          <h5 className="card-title" style={{fontWeight:"bold"}}>{acc.operator.join(", ")}</h5>
          <p className="card-text text-muted mb-0">{acc.id}</p>  {/* Dokumen ID langsung ditampilkan */}
          <p className="card-text">
            <strong>Level:</strong> {acc.level} | <strong>Story:</strong> {acc.story} | <strong>Orundum:</strong> {acc.orundum} | <strong>Originite:</strong> {acc.originite}
          </p>
        </div>

        {/* Kolom 2 - Tombol Beli */}
        <div className="col-3 justify-content-end p-3">
          <button className="btn btn-warning w-100" onClick={() => handleBuyClick(acc)}> Beli! </button>
          <p className="text-dark mt-1 d-flex justify-content-center">Rp.{acc.price} </p> 
        </div>
      </div>

      {/* Bagian Dropdown Detail */}
      {expandedCard === acc.id && (
        <div className="card-footer">
          <div className="d-flex justify-content-center">
            {acc.image1 && <iframe src={acc.image1} width="440" height="200" seamless></iframe>}
            {acc.image2 && <iframe src={acc.image2} width="440" height="200" seamless></iframe>}
          </div>
          <p className="mt-2"><strong>Detail:</strong> {acc.detail}</p>
        </div>
      )}

      {/* Tombol Lihat Detail */}
      <button className="btn btn-light w-100" onClick={() => toggleCard(acc.id)}>
        {expandedCard === acc.id ? "Tutup detail" : "Lihat lebih.."}
      </button>
    </div>
  ))}
</div>
    </div>
  );
};

export default AKAkunDesk;