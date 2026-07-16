import type { Request, Response } from "express";
import * as listingRepository from "../repositories/listing.repository.js";
import * as userRepository from "../repositories/user.repository.js";

export function overview(_req: Request, res: Response): void {
  const totalListings = listingRepository.countAll();
  const totalDonations = listingRepository.countDonations();

  res.json({
    totalListings,
    totalDonations,
    totalSales: totalListings - totalDonations,
    totalUsers: userRepository.countAll(),
    byCategory: listingRepository.countByCategory(),
  });
}
