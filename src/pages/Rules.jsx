import './Rules.css';

function Rules() {
  return (
    <main className="page-container">
      <h1 className="page-title">Game Rules</h1>
      <p className="page-subtitle">Learn how to play Sudoku</p>

      <div className="rules-content">
        <section className="rules-section">
          <h2 className="rules-section-title">Objective</h2>
          <p>
            The goal of Sudoku is to fill in every empty cell so that each row, each column, and
            each sub-grid contains the numbers 1 through X exactly once (where X is the size of the grid).
          </p>
        </section>

        <section className="rules-section">
          <h2 className="rules-section-title">How to Play</h2>
          <ol className="rules-list">
            <li>Some cells are pre-filled with <span className="term">given numbers</span> that cannot be changed.</li>
            <li>Each <span className="term">row</span> must contain each number exactly once.</li>
            <li>Each <span className="term">column</span> must contain each number exactly once.</li>
            <li>Each <span className="term">sub-grid</span> (the thicker-bordered boxes) must contain each number exactly once.</li>
            <li>Use <span className="term">logic and elimination</span> to determine the correct number for each empty cell.</li>
          </ol>
        </section>

        <section className="rules-section">
          <h2 className="rules-section-title">Grid Sizes</h2>
          <div className="grid-info">
            <div className="grid-type">
              <h3>Easy Mode</h3>
              <p>A 6x6 grid with six 3x2 sub-grids. Numbers range from 1 to 6. Half of the cells are pre-filled.</p>
            </div>
            <div className="grid-type">
              <h3>Normal Mode</h3>
              <p>A 9x9 grid with nine 3x3 sub-grids. Numbers range from 1 to 9. About 28-30 cells are pre-filled.</p>
            </div>
          </div>
        </section>

        <section className="rules-section">
          <h2 className="rules-section-title">Custom Puzzles</h2>
          <p>
            Logged-in players can create their own 9×9 puzzles from the Games page.
            Every submitted puzzle is verified on the server to guarantee it has exactly
            one valid solution before it is added to the catalogue.
          </p>
        </section>

        <section className="rules-section">
          <h2 className="rules-section-title">Tips for Beginners</h2>
          <ul className="tips-list">
            <li>Start with rows, columns, or sub-grids that already have the most numbers filled in.</li>
            <li>Use the process of elimination to narrow down possibilities.</li>
            <li>If you are stuck, try the easy mode first to get comfortable with the rules.</li>
            <li>Don&apos;t guess, use logic to deduce the correct value for each cell.</li>
          </ul>
        </section>
      </div>

      <div className="credits-section">
        <h2 className="rules-section-title">Credits</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Built by Xingchen Liu &amp; Xinyi Hu for CS5610 Project 3.
        </p>
        <div className="credits-links">
          <a href="mailto:liu.xingche@northeastern.edu" className="credit-link">Xingchen Email</a>
          <a href="mailto:hu.xinyi5@northeastern.edu" className="credit-link">Xinyi Email</a>
          <a href="https://github.com/ivanlxc" target="_blank" rel="noreferrer" className="credit-link">GitHub</a>
        </div>
      </div>
    </main>
  );
}

export default Rules;
