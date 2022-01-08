import Cors from 'cors'
import { GetJsonFromId } from '../../src/utils/getJson'

export default async function handler(req, res) {
  await Cors(req, res)
  const id = req.query.id;
  const file = await GetJsonFromId(id);
  res.status(200).json(file);
}
