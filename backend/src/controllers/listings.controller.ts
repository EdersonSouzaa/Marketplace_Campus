import type { Request, Response } from "express";
import * as listingRepository from "../repositories/listing.repository.js";
import { createListingSchema, listingQuerySchema, parseOrThrow } from "../lib/validation.js";
import { ForbiddenError, NotFoundError, UnauthorizedError } from "../lib/errors.js";
import { CATEGORIES } from "../types/index.js";

export function categories(_req: Request, res: Response): void {
  res.json({ categories: CATEGORIES });
}

export function list(req: Request, res: Response): void {
  const query = parseOrThrow(listingQuerySchema, req.query);

  if (query.mine && !req.user) {
    throw new UnauthorizedError("Faça login para ver seus próprios anúncios");
  }

  const listings = listingRepository.findMany({
    category: query.category,
    search: query.search,
    ownerId: query.mine ? req.user!.sub : undefined,
  });

  res.json({ listings });
}

export function getById(req: Request, res: Response): void {
  const listing = listingRepository.findById(Number(req.params.id));
  if (!listing) {
    throw new NotFoundError("Anúncio não encontrado");
  }
  res.json({ listing });
}

export function create(req: Request, res: Response): void {
  const data = parseOrThrow(createListingSchema, req.body);

  const listing = listingRepository.create({
    title: data.title,
    description: data.description,
    category: data.category,
    price: data.price,
    isDonation: data.isDonation,
    imageUrl: data.imageUrl,
    ownerId: req.user!.sub,
  });

  res.status(201).json({ listing });
}

export function remove(req: Request, res: Response): void {
  const listing = listingRepository.findById(Number(req.params.id));
  if (!listing) {
    throw new NotFoundError("Anúncio não encontrado");
  }
  if (listing.owner_id !== req.user!.sub) {
    throw new ForbiddenError("Você só pode remover os próprios anúncios");
  }

  listingRepository.deleteById(listing.id);
  res.status(204).send();
}
