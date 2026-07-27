import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Report() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [targetType] = useState(state.targetType);
  const [targetId] = useState(state.targetId);
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");

  const submitReport = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/reports", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          targetType,
          targetId,
          reason,
          description,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        navigate("/");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form onSubmit={submitReport}>
      <h2>Report</h2>

      <label>Reason</label>
      <select
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      >
        <option value="">Select a reason</option>
        <option value="Spam">Spam</option>
        <option value="Harassment">Harassment</option>
        <option value="Hate Speech">Hate Speech</option>
        <option value="Violence">Violence</option>
        <option value="Misinformation">Misinformation</option>
        <option value="Other">Other</option>
      </select>

      <label>Description (optional)</label>
      <textarea
        placeholder="Tell us more..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button type="submit">
        Submit Report
      </button>
    </form>
  );
}

export default Report;