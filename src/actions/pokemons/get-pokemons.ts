import { pokeApi } from "../../config/api/pokeAPI";
import type { Pokemon } from "../../domain/entities/pokemon";
import type { PokeAPIPaginatedResponse, PokeAPIPokemon } from "../../infraestructure/interfaces/pokeapi.interfaces";
import { PokemonMapper } from "../../infraestructure/mappers/pokemon.mappers";

export const sleep = async () => {
    return new Promise(resolve =>  setTimeout(resolve, 2000));
}

export const getPokemons = async (page: number, limit: number = 20):Promise<Pokemon[]> => {

    //await sleep();

    try {
        const url = `/pokemon??offset=${page * 10 }&limit=${limit}`;
        const {data} = await pokeApi.get<PokeAPIPaginatedResponse>(url);

        const pokemonPromises = data.results.map( (info) => {
            return pokeApi.get<PokeAPIPokemon>(info.url)
        });

        const pokeApiPokemon = await Promise.all(pokemonPromises)

        const pokemonsPromises = pokeApiPokemon.map( (item) => PokemonMapper.pokeApiPokemonToEntity(item.data));


        
        return await Promise.all(pokemonsPromises);

        

    } catch (error) {
        throw new Error(`Error getting pokemons: ${error}`)
    }
}