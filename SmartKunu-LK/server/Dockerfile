# Use Microsoft .NET SDK image to build app
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY ["SmartKunu.Server.csproj", "./"]
RUN dotnet restore "SmartKunu.Server.csproj"

# Copy source code and build
COPY . .
RUN dotnet publish "SmartKunu.Server.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Production runtime image
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Render exposes PORT environment variable dynamically
ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "SmartKunu.Server.dll"]
