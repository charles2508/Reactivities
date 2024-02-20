FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build-env
WORKDIR /app
EXPOSE 8080

# copy .csproj solution files and run dotnet restore to install all required packages
COPY "Reactivities.sln" "Reactivities.sln"
COPY "API/API.csproj" "API/API.csproj"
COPY "Application/Application.csproj" "Application/Application.csproj"
COPY "Domain/Domain.csproj" "Domain/Domain.csproj"
COPY "Infrastructure/Infrastructure.csproj" "Infrastructure/Infrastructure.csproj"
COPY "Persistence/Persistence.csproj" "Persistence/Persistence.csproj"

RUN dotnet restore "Reactivities.sln"

# copy the rest of the files/folders and build to the "out" directory
COPY . .
WORKDIR /app
RUN dotnet publish -c Release -o out

# Create a new runtime build image
FROM mcr.microsoft.com/dotnet/aspnet:7.0
WORKDIR /app
COPY --from=build-env /app/out .
ENTRYPOINT [ "dotnet", "API.dll" ]