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


const editFunding = async (req, res) => {
  const { funding_id } = req.params;
  const { projectid, source, amount, utilization_status } = req.body;

  try {
    const result = await pool.query('UPDATE funding SET projectid = $1, source = $2, amount = $3, utilization_status = $4 WHERE funding_id = $5', [projectid, source, amount, utilization_status, funding_id]);
    if (result.rowCount === 0) {
      return res.status(404).send('Funding not found');
    }
    res.status(200).send('Funding details updated');
  } catch (err) {
    console.error('Error updating funding:', err);
    res.status(500).send('Error updating funding details');
  }
};

const partiallyUpdateFunding = async (req, res) => {
  const { funding_id } = req.params;
  const { projectid, source, amount, utilization_status} =  req.body;
  const fieldsToUpdate = [];
  const values = [];
  let index = 1;
  if (projectid) {
    fieldsToUpdate.push(`projectid = $${index++}`);
    values.push(projectid);
  }
  if (source) {
    fieldsToUpdate.push(`source = $${index++}`);
    values.push(source);
  }
  if (amount) {
    fieldsToUpdate.push(`amount = $${index++}`);
    values.push(amount);
  }
  if (utilization_status) {
    fieldsToUpdate.push(`utilization_status = $${index++}`);
    values.push(utilization_status);
  }
  values.push(funding_id);
  const query = `UPDATE funding SET ${fieldsToUpdate.join(', ')} WHERE funding_id = $${index}`;
  try {
    const result = await pool.query(query, values);
    if (result.rowCount === 0) {
      return res.status(404).send('Funding not found');
    }
    res.status(200).send('Funding details updated');
  } catch (err) {
    console.error('Error partially updating funding:', err);
    res.status(500).send('Error partially updating funding details');
  }
};

const deleteFunding = async (req, res) => {
  const { funding_id } = req.params;
  try {
    const result = await pool.query('DELETE FROM funding WHERE funding_id = $1', [funding_id]);
    if (result.rowCount === 0) {
      return res.status(404).send('Funding not found');
    }
    res.status(200).send('Funding deleted successfully');
  } catch (err) {
    console.error('Error deleting funding:', err);
    res.status(500).send('Error deleting funding details');
  }
}


const addFunding = async (req, res) => {
  const { projectid, source, amount, utilization_status } = req.body;
  try {
    await pool.query('INSERT INTO funding (projectid, source, amount, utilization_status) VALUES ($1, $2, $3, $4)', [projectid, source, amount, utilization_status]);
    res.status(201).send('Funding details updated');
  } catch (err) {
    res.status(500).send('Error adding funding details');
  }
};

module.exports = { getAllFunding, addFunding, editFunding, deleteFunding, partiallyUpdateFunding };
