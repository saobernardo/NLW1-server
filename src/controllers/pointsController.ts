import {Request, response, Response} from 'express';

import knex from '../database/connection';

class PointsController{

    async index(req: Request, res: Response){
        const {city, uf, items} = req.query;
        const parsedItems = String(items).split(',').map(item => Number(item.trim()));

        const points = await knex('points')
            .join('point_items', 'points.id', "=", "point_items.point_id")
            .whereIn('point_items.item_id', parsedItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('points.*');

        return res.json(points);
    }

    async create(req: Request, res: Response){
        const {
            name, email, whatsapp, latitude, longitude, city, uf, items
        } = req.body;
    
        //transaction: se der erro em algum dos comandos de banco, realiza um rollback. Senão, um commit
        const trx = await knex.transaction();
        const point = {
            image: 'https://images.unsplash.com/photo-1638984849928-889ecdd4cdbd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=320&q=60',
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
        }
    
        //insere os dados na tabela e pega a variável
        const insertedIds = await trx('points').insert(point);
    
        const point_id = insertedIds[0];
    
        //inserindo na tabela point_items
        const pointItems = items.map((item_id: number) => {
            return {
                item_id,
                point_id
            }
        });
    
        await trx('point_items').insert(pointItems);

        await trx.commit();
    
        return res.json({id: point_id, ...point});
    }

    async show(req: Request, res: Response){
        const {id} = req.params;

        const point = await knex('points').where('id', id).first();

        if(!point) {
            return res.status(400).json({ message: 'Point not found'});
        }

        const items = await knex('items')
            .join('point_items', 'items.id', '=' ,"point_items.item_id")
            .where('point_items.point_id', id)
            .select('items.title');

        return res.json({point, items});
    }

    async delete(req: Request, res: Response){
        const {id} = req.params;

        await knex('points').where('points.id', id).del();

        return res.json({msg: `Ponto ${id} excluído`});
    }
}

export default PointsController;