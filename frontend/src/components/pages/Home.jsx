import Feed from "./posts/Feed.jsx";

function Home() {
  return (
    <main className="page">
      <section className="hero">
        <div>
          <h1>Pulse</h1>
        </div>
      </section>
      <Feed />
    </main>
  );
}

export default Home;
