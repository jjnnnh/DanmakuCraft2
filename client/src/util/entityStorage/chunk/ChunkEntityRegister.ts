import {Region, StationaryEntity} from '../../../entitySystem/alias';
import Chunks from './Chunks';
import EntityFactory from '../../../entitySystem/EntityFactory';
import {VisibilityUpdatedEvent} from '../EntityFinder';
import {Phaser} from '../../alias/phaser';
import {asSequence} from 'sequency';
import Iterator from '../../syntax/Iterator';
import EntityRegister from '../EntityRegister';

class ChunkEntityRegister<T extends StationaryEntity> implements EntityRegister<T> {
  constructor(
      private chunks: Chunks<Region<T>>,
      private entityRegistered: Phaser.Signal<VisibilityUpdatedEvent<Region<T>>>,
      private entityFactory: EntityFactory) {
  }

  register(entity: T) {
    let chunk = this.chunks.getChunkByCoordinates(entity.coordinates);
    let newChunk = this.entityFactory.cloneRegion(chunk);
    newChunk.container.add(entity);

    this.chunks.replaceChunkByCoordinates(newChunk.coordinates, newChunk);

    this.entityRegistered.dispatch(new VisibilityUpdatedEvent([newChunk], [chunk]));
  }

  registerBatch(entities: Iterable<T>) {
    let entitiesArray = Array.from(entities);

    if (entitiesArray.length === 0) {
      return;
    }

    let chunksToReplace = new Map<Region<T>, T[]>();
    for (let entity of entitiesArray) {
      let chunkToReplace = this.chunks.getChunkByCoordinates(entity.coordinates);

      let entitiesToAdd = chunksToReplace.get(chunkToReplace);
      if (entitiesToAdd == null) {
        entitiesToAdd = [];
        chunksToReplace.set(chunkToReplace, entitiesToAdd);
      }

      entitiesToAdd.push(entity);
    }

    let newChunks: Array<Region<T>> = [];
    let oldChunks: Array<Region<T>> = [];
    chunksToReplace.forEach((entitiesToAdd, chunk) => {
      let newChunk = this.entityFactory.cloneRegion(chunk);
      for (let entity of entitiesToAdd) {
        newChunk.container.add(entity);
      }

      this.chunks.replaceChunkByCoordinates(newChunk.coordinates, newChunk);

      newChunks.push(newChunk);
      oldChunks.push(chunk);
    });

    this.entityRegistered.dispatch(new VisibilityUpdatedEvent(newChunks, oldChunks));
  }

  deregister(entity: T, silent?: boolean) {
    // TODO
    throw new Error('Not implemented');
  }

  count() {
    return asSequence(this.chunks).map(chunk => chunk.container.count()).sum();
  }

  [Symbol.iterator]() {
    let entities = asSequence(this.chunks)
        .flatMap(chunk => asSequence(chunk.container))
        .asIterable();
    return Iterator.of(entities);
  }
}

export default ChunkEntityRegister;
