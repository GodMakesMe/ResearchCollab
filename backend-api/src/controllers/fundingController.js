const pool = require('../db/db');


const getAllFunding = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const result = await pool.query('SELECT * FROM funding ORDER BY funding_id LIMIT $1 OFFSET $2', [limit, offset]);
    const totalCount = await pool.query('SELECT COUNT(*) FROM funding');

    const totalPages = Math.ceil(totalCount.rows[0].count / limit);

    res.status(200).json({
      fundings: result.rows,
      pagination: {
        page,
        totalPages,
        totalCount: parseInt(totalCount.rows[0].count),
      }
    });
  } catch (err) {
    console.error('Error fetching funding data:', err);
    res.status(500).send('Error fetching all funding');
  }
};



const addFunding = async (req, res) => {
  const { projectid, source, amount, utilization_status } = req.body;
  try {
    await pool.query('INSERT INTO funding (projectid, source, amount, utilization_status) VALUES ($1, $2, $3, $4)', [projectid, source, amount, utilization_status]);
    res.status(201).send('Funding details updated');
  } catch (err) {
    res.status(500).send('Error adding funding details');
  }
};

module.exports = { getAllFunding, addFunding };
