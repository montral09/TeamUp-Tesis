﻿using backend.Data_Access.VO.Data;
using backend.Logic.Entities;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;

namespace backend.Logic
{
    public class Util
    {

        public static string GetRandomString()
        {
            string path = Path.GetRandomFileName();
            path = path.Replace(".", "");
            return path;
        }

        public static string CreateFacilitiesString(List<int> facilities)
        {
            return String.Join<int>(",", facilities);
        }

        public int GetRanking(List<Review> reviews)
        {
            int ranking = 0;
            int totalRankings = 0;
            if (reviews.Count != 0)
            {
                foreach (var item in reviews)
                {
                    totalRankings += item.Rating;
                }
                ranking = (int)Math.Ceiling((decimal)totalRankings / reviews.Count);
            }           
            return ranking;
        }      

        public int ConvertStateReservation(string oldState)
        {

            switch (oldState)
            {
                case "PENDING":
                    return 1;
                case "RESERVED":
                    return 2;
                case "IN PROGRESS":
                    return 3;                
                case "FINISHED":
                    return 4;
                case "CANCELED":
                    return 5;
                default:
                    return 0;
            }
        }
        
        public static string ConvertDateToString(DateTime date)
        {
            if (date != null)
            {
                return date.ToString("dd/MM/yyyy");
            }
            return "";
        }

        public static List<T> ShuffleRecommended<T>(IList<T> recommended)
        {
            List<T> randomRecommended = new List<T>();
            Random randomNumber = new Random();            
            while (recommended.Count() > 0)
            {                
                var nextIndex = randomNumber.Next(0, recommended.Count());                
                T value = recommended[nextIndex];                
                randomRecommended.Add(value);
                recommended.RemoveAt(nextIndex);
            }
            return randomRecommended;
        }

        public static int CalculateReservationCommission(int reservationPrice)
        {
            int commission = Convert.ToInt32(ConfigurationManager.AppSettings["COMMISSION"]);
            return reservationPrice * commission / 100;
        }


        /// <summary>
        /// Calculate remaining amout to be paid
        /// Calculation: [new plan price] * [daysLeft] - [old plan price] * [daysLeft]
        /// </summary>
        /// <param name="newPlanPrice"></param>
        /// <param name="daysLeft"></param>
        /// <param name="currentPreferentialPlan"></param>
        /// <param name="preferentialPlans"></param>
        /// <returns> amount to be paid </returns>
        internal static int RecalculatePrice(int newPlanPrice, int daysLeft, int currentPreferentialPlan, List<PublicationPlan> preferentialPlans)
        {
            int currentPlanPricePerDay = 0;
            int newTotalPrice;
            foreach (PublicationPlan publicationPlan in preferentialPlans)
            {
                if (publicationPlan.IdPlan == currentPreferentialPlan)
                {
                    currentPlanPricePerDay = Convert.ToInt32(publicationPlan.Price / publicationPlan.Days);
                }
            }
            newTotalPrice = newPlanPrice - currentPlanPricePerDay * daysLeft;
            
            return newTotalPrice;            
        }
    }
}
