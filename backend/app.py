import os
import pandas as pd
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import create_access_token, jwt_required, JWTManager
from flask_bcrypt import Bcrypt
from sklearn.linear_model import LinearRegression
import numpy as np
